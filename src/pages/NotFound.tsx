import Link from "next/link";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <h1 className="text-9xl font-bold text-primary-200">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-800 mt-4">Page Not Found</h2>
      <p className="text-neutral-500 mt-2">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="btn btn-primary mt-6">
        <Home size={18} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
