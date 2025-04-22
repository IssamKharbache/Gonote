import { CgSpinner } from "react-icons/cg";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const LoadingButton = ({
  isLoading = false,
  className = "",
  children,
  ...props
}: LoadingButtonProps) => {
  const baseClasses =
    "w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 py-1 px-4 text-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center  rounded-full cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <CgSpinner className="animate-spin h-8 w-8 mr-2" />
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
