import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (

<main className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
          <img
        src="/404.png"
        alt="404 Not Found"
        className="w-80 -mt-14"
      />
  <div className="text-center">
    <h1 className="-mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page not found</h1>
    <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Sorry, we couldn't find the page you’re looking for.</p>
    <div className="mt-10 flex items-center justify-center gap-x-6">
    <Link
        to="/"
        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Kembali ke Beranda
      </Link>
    </div>
  </div>
</main>
  );
};

export default NotFound;
