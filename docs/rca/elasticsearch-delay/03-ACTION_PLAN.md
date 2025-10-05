# Backend Team: Action Items - Elasticsearch vs MongoDB

## 🎯 Executive Summary

**Issue**: Admin dashboard experiences 1-2 second delay when creating/deleting data.

**Root Cause**: Using Elasticsearch for admin list queries. Elasticsearch has ~1 second refresh interval by design (near real-time, not real-time).

**Solution**: Use MongoDB for admin CRUD operations, keep Elasticsearch for public search features.

**Priority**: HIGH - Blocking production deployment

**Estimated Effort**: 2-4 hours

---

## 📋 Backend Changes Required

### 1. Create New Admin Controller (MongoDB Direct Queries)

**File**: `app/controllers/admin/roles_controller.rb`

```ruby
class Admin::RolesController < AdminController
  before_action :authenticate_admin!

  # GET /api/v1/admin/roles
  # Change: Query MongoDB directly instead of Elasticsearch
  def index
    @roles = Role.all                        # ✅ MongoDB query
                 .order(created_at: :desc)   # Newest first
                 .page(params[:page])
                 .per(params[:per_page] || 10)

    # Simple text search using MongoDB (if needed)
    if params[:query].present? && params[:query] != "*"
      @roles = @roles.where(name: /#{Regexp.escape(params[:query])}/i)
    end

    render json: {
      status: 'success',
      message: 'Roles fetched successfully',
      data: @roles.as_json(
        only: [:_id, :name, :description, :created_at, :updated_at]
      ),
      meta: {
        current_page: @roles.current_page,
        per_page: @roles.limit_value,
        total_pages: @roles.total_pages,
        total_count: @roles.total_count
      }
    }
  end

  # POST /api/v1/admin/roles
  # Change: Add async Elasticsearch sync
  def create
    @role = Role.create!(role_params)

    # Sync to Elasticsearch asynchronously (fire and forget)
    RoleIndexerJob.perform_later(@role.id)

    render json: {
      status: 'success',
      message: 'Role created successfully',
      data: @role
    }, status: :created
  end

  # PUT /api/v1/admin/roles/:id
  # Change: Add async Elasticsearch sync
  def update
    @role = Role.find(params[:id])
    @role.update!(role_params)

    # Sync to Elasticsearch asynchronously
    RoleIndexerJob.perform_later(@role.id)

    render json: {
      status: 'success',
      message: 'Role updated successfully',
      data: @role
    }
  end

  # DELETE /api/v1/admin/roles/:id
  # Change: Add async Elasticsearch removal
  def destroy
    @role = Role.find(params[:id])
    role_id = @role.id
    @role.destroy!

    # Remove from Elasticsearch asynchronously
    RoleIndexerJob.perform_later(role_id, action: :delete)

    render json: {
      status: 'success',
      message: 'Role deleted successfully'
    }
  end

  private

  def role_params
    params.require(:role).permit(:name, :description)
  end
end
```

### 2. Create Background Job for Elasticsearch Sync

**File**: `app/jobs/role_indexer_job.rb`

```ruby
class RoleIndexerJob < ApplicationJob
  queue_as :default

  retry_on StandardError, wait: 5.seconds, attempts: 3

  def perform(role_id, action: :index)
    case action
    when :index
      role = Role.find(role_id)
      role.__elasticsearch__.index_document

      Rails.logger.info("[Elasticsearch] Indexed role #{role_id}: #{role.name}")

    when :delete
      Role.__elasticsearch__.client.delete(
        index: Role.index_name,
        id: role_id
      )

      Rails.logger.info("[Elasticsearch] Deleted role #{role_id}")
    end

  rescue Mongoid::Errors::DocumentNotFound => e
    Rails.logger.warn("[Elasticsearch] Role #{role_id} not found, skipping index")

  rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
    Rails.logger.warn("[Elasticsearch] Role #{role_id} not in index, skipping delete")

  rescue StandardError => e
    Rails.logger.error("[Elasticsearch] Failed to sync role #{role_id}: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    raise # Will trigger retry
  end
end
```

### 3. Update Routes

**File**: `config/routes.rb`

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Admin routes - Use MongoDB directly
      namespace :admin do
        resources :roles, only: [:index, :show, :create, :update, :destroy]
        # TODO: Apply same pattern to:
        # resources :categories
        # resources :event_types
        # resources :events
      end

      # Public routes - Use Elasticsearch
      namespace :public do
        get 'search/roles', to: 'search#roles'
        # TODO: Add other search endpoints
      end
    end
  end
end
```

### 4. Create Public Search Controller (Future)

**File**: `app/controllers/public/search_controller.rb`

```ruby
class Public::SearchController < ApplicationController
  # GET /api/v1/public/search/roles?q=admin
  # Uses Elasticsearch for fast full-text search
  def roles
    query = params[:q].to_s.strip

    if query.blank?
      return render json: {
        status: 'error',
        message: 'Query parameter required'
      }, status: :bad_request
    end

    @results = Role.search(
      query: {
        multi_match: {
          query: query,
          fields: ['name^2', 'description'],  # Name has higher weight
          fuzziness: 'AUTO'                   # Fuzzy matching
        }
      },
      size: params[:limit] || 20
    )

    render json: {
      status: 'success',
      data: @results.records.as_json(
        only: [:_id, :name, :description, :created_at]
      ),
      meta: {
        total: @results.total,
        took_ms: @results.took,
        max_score: @results.max_score
      }
    }

  rescue StandardError => e
    Rails.logger.error("[Search] Failed to search roles: #{e.message}")

    render json: {
      status: 'error',
      message: 'Search failed, please try again'
    }, status: :internal_server_error
  end
end
```

### 5. Update Model (Optional but Recommended)

**File**: `app/models/role.rb`

```ruby
class Role < ApplicationRecord
  include Mongoid::Document
  include Mongoid::Timestamps
  include Elasticsearch::Model  # Keep for public search

  # Fields
  field :name, type: String
  field :description, type: String

  # Validations
  validates :name, presence: true, uniqueness: true

  # Indexes
  index({ name: 1 }, { unique: true })
  index({ created_at: -1 })

  # Elasticsearch settings (for public search only)
  settings index: {
    number_of_shards: 1,
    number_of_replicas: 0
  } do
    mappings dynamic: 'false' do
      indexes :name, type: 'text', analyzer: 'standard'
      indexes :description, type: 'text', analyzer: 'standard'
      indexes :created_at, type: 'date'
    end
  end

  # Async reindex after changes (for public search)
  after_commit :reindex_async, on: [:create, :update]
  after_commit :remove_from_index_async, on: :destroy

  private

  def reindex_async
    RoleIndexerJob.perform_later(id.to_s, action: :index)
  rescue StandardError => e
    Rails.logger.error("[Role] Failed to queue reindex job: #{e.message}")
  end

  def remove_from_index_async
    RoleIndexerJob.perform_later(id.to_s, action: :delete)
  rescue StandardError => e
    Rails.logger.error("[Role] Failed to queue delete job: #{e.message}")
  end
end
```

---

## 🧪 Testing Guide

### 1. Test Admin Endpoints (MongoDB)

```bash
# Set base URL
BASE_URL="http://localhost:3000/api/v1"

# Test: List roles (should be immediate)
curl -X GET "$BASE_URL/admin/roles" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: Fast response (~50ms), data from MongoDB

# Test: Create role
curl -X POST "$BASE_URL/admin/roles" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": {
      "name": "Test Role",
      "description": "Test Description"
    }
  }'

# Expected:
# - Returns created role immediately
# - Background job queued for Elasticsearch sync

# Test: List again (should include new role immediately)
curl -X GET "$BASE_URL/admin/roles" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected:
# - New role appears in list immediately ✅
# - No delay needed ✅

# Test: Update role
curl -X PUT "$BASE_URL/admin/roles/ROLE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": {
      "name": "Updated Role",
      "description": "Updated Description"
    }
  }'

# Test: Delete role
curl -X DELETE "$BASE_URL/admin/roles/ROLE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected:
# - Role deleted immediately
# - Removed from list immediately ✅
```

### 2. Test Public Search (Elasticsearch)

```bash
# Test: Search roles
curl -X GET "$BASE_URL/public/search/roles?q=admin" \
  -H "Content-Type: application/json"

# Expected:
# - Fast full-text search
# - May have 1-2 second delay for new data (this is OK!)
# - Fuzzy matching works
```

### 3. Verify Background Jobs

```bash
# Check Sidekiq/delayed_job dashboard
# Look for RoleIndexerJob entries

# Check logs
tail -f log/development.log | grep "Elasticsearch"

# Expected logs:
# [Elasticsearch] Indexed role 123abc: Test Role
# [Elasticsearch] Deleted role 456def
```

### 4. Test Error Scenarios

```bash
# Test: Invalid data
curl -X POST "$BASE_URL/admin/roles" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": {"name": ""}}'

# Expected: 422 Unprocessable Entity with validation errors

# Test: Duplicate name
curl -X POST "$BASE_URL/admin/roles" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": {"name": "Admin"}}'

# Expected: 422 with "Name already exists" error
```

---

## 📊 Verification Checklist

### Backend

- [ ] `Admin::RolesController` created and uses MongoDB queries
- [ ] `RoleIndexerJob` created for async Elasticsearch sync
- [ ] Routes updated to separate admin vs public
- [ ] Model callbacks updated for async sync
- [ ] All tests passing
- [ ] Background job worker running (Sidekiq/delayed_job)

### Performance

- [ ] List query response time < 100ms (MongoDB direct)
- [ ] Create operation response time < 200ms
- [ ] Data appears in list immediately after create ✅
- [ ] Data removed from list immediately after delete ✅
- [ ] No 1-2 second delay for admin operations ✅

### Logging

- [ ] Elasticsearch sync operations logged
- [ ] Errors logged with context
- [ ] Job retries working for failed syncs

---

## ⚠️ Important Notes

### 1. Elasticsearch is Optional for Admin

- If Elasticsearch is down, admin dashboard still works ✅
- Only public search is affected
- This is a feature, not a bug!

### 2. Don't Force Refresh

```ruby
# ❌ DON'T DO THIS - Kills performance
Role.__elasticsearch__.refresh_index!
```

### 3. Async Sync is Intentional

- Admin operations: Immediate (MongoDB)
- Elasticsearch sync: Async (1-2 seconds)
- Public search: Eventually consistent (acceptable)

### 4. Data Consistency

- **MongoDB** = Source of truth (always consistent)
- **Elasticsearch** = Search index (eventually consistent)
- Always trust MongoDB over Elasticsearch

---

## 🔄 Migration Plan

### Phase 1: Development Environment (Today)

1. Create new controllers and jobs
2. Update routes
3. Test manually
4. Verify background jobs working

### Phase 2: Staging Environment (Tomorrow)

1. Deploy changes to staging
2. Run integration tests
3. Monitor logs for errors
4. Performance testing

### Phase 3: Production (After Verification)

1. Deploy to production during low-traffic period
2. Monitor metrics closely
3. Watch for errors in logs
4. Rollback plan ready

---

## 🎯 Success Criteria

### Admin Dashboard

✅ Create role → Data appears immediately (no delay)  
✅ Update role → Changes appear immediately  
✅ Delete role → Data removes immediately  
✅ List query < 100ms response time  
✅ No 200ms artificial delays needed

### Public Search

✅ Search works via Elasticsearch  
✅ Full-text search performs well  
✅ 1-2 second eventual consistency acceptable  
✅ Fuzzy matching works

### System Health

✅ Background jobs processing successfully  
✅ No errors in logs  
✅ Elasticsearch sync working  
✅ Admin works even if Elasticsearch is down

---

## 📚 Additional Resources

- **Full Documentation**: `/docs/ELASTICSEARCH_VS_MONGODB.md`
- **Quick Reference**: `/docs/ELASTICSEARCH_VS_MONGODB_QUICK_REFERENCE.md`
- **Elasticsearch Docs**: https://www.elastic.co/guide/en/elasticsearch/reference/current/near-real-time.html
- **Industry Patterns**: See "Designing Data-Intensive Applications" by Martin Kleppmann

---

## 🤝 Support

### Questions?

- Check `/docs/ELASTICSEARCH_VS_MONGODB.md` for detailed explanations
- Review industry patterns from GitHub, Shopify, Stripe
- This is a standard pattern, well-documented

### Issues?

- Check background job logs
- Verify Elasticsearch is running
- Confirm MongoDB queries are working
- Review error messages in Rails logs

---

## ✅ Summary

**What to Change**:

- Admin endpoints: Query MongoDB directly (not Elasticsearch)
- Add background job for async Elasticsearch sync
- Separate admin routes from public search routes

**Why**:

- Elasticsearch has 1-2 second refresh delay (by design)
- Admin dashboard needs immediate consistency
- This is industry-standard pattern

**Result**:

- Immediate data consistency ✅
- 200ms faster operations ✅
- Simpler frontend code ✅
- Better user experience ✅

**Effort**: 2-4 hours

**Priority**: HIGH

---

**Ready to Start?** Follow the implementation steps above, test thoroughly, and deploy to staging first.
