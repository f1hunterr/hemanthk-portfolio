export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg)] px-5">
      <div className="w-full max-w-lg border border-[var(--line)]">
        <div className="cell-strip mono-label">
          <span>Error</span>
          <span className="text-[var(--faint)]">404</span>
        </div>
        <div className="px-5 md:px-8 py-10">
          <h1 className="headline">
            Page <em>not</em> found.
          </h1>
          <p className="mt-4 text-[var(--muted)]">The page you're looking for doesn't exist or has moved.</p>
          <a href={import.meta.env.BASE_URL} className="btn btn-solid mt-8">
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
