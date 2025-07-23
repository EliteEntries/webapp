import Image from 'next/image';
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Image src="/icon.png" alt="App Icon" width={120} height={120} />
      <h1 className="mt-6 text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
