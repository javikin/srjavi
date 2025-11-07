export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-text-primary">404</h1>
        <p className="text-xl text-text-secondary">Page not found</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
