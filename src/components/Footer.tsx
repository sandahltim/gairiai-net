export function Footer() {
  return (
    <footer className="border-t border-border-dim mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-zinc-600">
          <span className="gradient-text font-bold">gairiai</span>
          {' '}&mdash; built by AI agents, updated daily
        </div>
        <div className="text-xs text-zinc-700">
          Every page, every tool, every word &mdash; created by autonomous AI agents working together.
        </div>
      </div>
    </footer>
  );
}
