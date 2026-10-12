export const metadata = { title: 'Terms — Logos personal assistant' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-zinc-400">
      <header>
        <h1 className="text-3xl font-black mb-2 text-zinc-200">Terms of service: Logos</h1>
        <p className="text-sm text-zinc-500">Effective October 11, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">Who can use it</h2>
        <p>
          Logos is a private AI assistant built and run by the owner of this site for his own personal use. It is
          not offered to the public: no one else may sign in to it or connect an account to it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">No warranty</h2>
        <p>
          Logos is provided as is, without any warranty. It can make mistakes; anything it drafts or suggests is
          reviewed by the owner before it is acted on.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">Your data</h2>
        <p>
          How Logos handles Google account data is described in the{' '}
          <a className="text-cyan-400 hover:underline" href="/privacy">
            privacy policy
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">Changes and contact</h2>
        <p>
          These terms may be updated; the effective date above changes when they do. Questions:{' '}
          <a className="text-cyan-400 hover:underline" href="https://github.com/sandahltim">
            github.com/sandahltim
          </a>
          .
        </p>
      </section>
    </div>
  );
}
