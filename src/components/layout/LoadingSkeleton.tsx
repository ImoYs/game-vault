export default function LoadingSkeleton() {
    return (
      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md animate-pulse">
        <h1 className="text-3xl font-bold text-center mb-4 bg-gray-300 h-8 w-48 mx-auto rounded"></h1>
  
        {/* Skeleton Search Bar & Dropdown */}
        <div className="max-w-3xl mx-auto flex space-x-4 mb-6">
          {/* Search Input Skeleton */}
          <div className="relative w-full">
            <div className="h-10 bg-gray-300 rounded-md"></div>
          </div>
  
          {/* Genre Dropdown Skeleton */}
          <div className="relative w-44">
            <div className="h-10 bg-gray-300 rounded-md"></div>
          </div>
  
          {/* Search Button Skeleton */}
          <div className="h-10 w-24 bg-gray-300 rounded-md"></div>
        </div>
  
        {/* Skeleton for Game Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 bg-gray-300"></div>
              <div className="h-6 bg-gray-300 w-3/4 mx-auto mt-2 rounded"></div>
            </div>
          ))}
        </div>
  
        {/* Load More Button Skeleton */}
        <div className="flex justify-center mt-6">
          <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    );
  }
  