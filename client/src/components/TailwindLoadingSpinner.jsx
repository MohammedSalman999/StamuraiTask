const TailwindLoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-black">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-purple-500"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-blue-500 animate-ping"></div>
      </div>
      <span className="mt-4 text-lg font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
        {message}
      </span>
    </div>
  );
};

export default TailwindLoadingSpinner;
