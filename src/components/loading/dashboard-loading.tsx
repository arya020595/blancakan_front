/**
 * Dashboard Loading Components
 * Reusable loading states for dashboard sections
 */

export function SidebarSkeleton() {
  return (
    <div className="w-64 bg-white shadow-sm animate-pulse">
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
      <nav className="mt-8">
        <div className="px-3 space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-2 py-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="bg-white shadow-sm animate-pulse">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function MainContentSkeleton() {
  return (
    <div className="flex-1">
      <HeaderSkeleton />
      <main className="flex-1">
        <div className="py-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
