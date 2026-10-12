export const metadata = { title: 'Privacy — Logos personal assistant' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-zinc-400">
      <header>
        <h1 className="text-3xl font-black mb-2 text-zinc-200">Privacy policy: Logos</h1>
        <p className="text-sm text-zinc-500">Effective October 11, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">What Logos is</h2>
        <p>
          Logos is a private, single-user AI assistant run by the owner of this site for his own use. It is not a
          public service: the only Google account it connects to is the owner&apos;s own, and nobody else can sign
          in to it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">Google data it accesses</h2>
        <p>
          With the owner&apos;s permission (Google OAuth), Logos can read and organize Gmail, read and manage Google
          Calendar events, work with Google Drive, Docs and Sheets files, and read Google Contacts. It uses this data
          only to help the owner: summarizing and sorting email, drafting replies, previewing the day&apos;s
          schedule, and finding or editing documents he asks about. Logos does not send email on its own; it sends
          only what the owner has approved.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">Where the data goes</h2>
        <p>
          The OAuth token and any working copies are stored on the owner&apos;s own computers. Most processing
          happens on AI models running on that hardware. For harder tasks, a request may be sent to an AI model
          provider the owner has an account with (for example OpenAI), under that provider&apos;s terms. Google user
          data is never sold, never used for advertising, never shared with anyone else, and never used to train
          AI models.
        </p>
        <p>
          Logos&apos;s use of information received from Google APIs adheres to the{' '}
          <a
            className="text-cyan-400 hover:underline"
            href="https://developers.google.com/terms/api-services-user-data-policy"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">Removing access</h2>
        <p>
          Access can be revoked at any time at{' '}
          <a className="text-cyan-400 hover:underline" href="https://myaccount.google.com/permissions">
            myaccount.google.com/permissions
          </a>
          , after which Logos can no longer access the account and its stored token is deleted.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-300">Contact</h2>
        <p>
          Questions about this policy:{' '}
          <a className="text-cyan-400 hover:underline" href="https://github.com/sandahltim">
            github.com/sandahltim
          </a>
          .
        </p>
      </section>
    </div>
  );
}
