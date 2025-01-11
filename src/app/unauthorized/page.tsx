import Link from "next/link";

const Unauthorized: React.FC = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
        <p className="text-gray-600 mt-4">You don&apos;t have permission to access this page.</p>
        <Link href="/" className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go Back to Home
        </Link>
      </div>
    );
  };
  
  export default Unauthorized;
  