// components/LoadingSpinner.jsx
const LoadingSpinner = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 bg-black z-50">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner;
