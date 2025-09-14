/**
 * Dashboard Loading UI
 * Shown instantly when navigating to any dashboard page
 */

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <nav className="mt-8">
            <div className="px-6 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="px-8 py-4 flex justify-between items-center">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="bg-white rounded-lg p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
