import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="relative min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <video
        src="/star.mp4"
        muted
        loop
        autoPlay
        className="fixed top-0 left-0 w-full h-full object-cover"
      />

      <div className="w-full max-w-md text-center relative z-10">
        <h1 className="text-6xl font-extrabold text-white mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-200 mb-2">Page Not Found</p>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-200"
        >
          Back to Login
        </Link>
      </div>
    </section>
  );
}
