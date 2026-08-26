export function AdminPage({ children }) {
  return <div className="px-5 py-8 md:px-10 md:py-12">{children}</div>;
}

export function PageHeader({ title, meta, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-soft)]">
          Admin
        </p>
        <h1 className="mt-1 text-xl font-light text-[var(--text-main)] md:text-2xl">
          {title}
          {meta && (
            <span className="ml-3 text-sm font-normal text-[var(--text-soft)]">{meta}</span>
          )}
        </h1>
      </div>
      {action}
    </div>
  );
}
