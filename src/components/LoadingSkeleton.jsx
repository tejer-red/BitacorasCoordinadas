// components/LoadingSkeleton.jsx
const LoadingSkeleton = ({ count = 5 }) => {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-4 border-b animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    ));
  };
  
  export default LoadingSkeleton;