import { Metadata } from 'next';
import { Users, Bot, HardDrive, ArrowRight, Mail, Flame } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pitboss — Employee Incentives That Work | gairiai',
  description:
    'Peer-voting incentive system built for rental yards, delivery fleets, and service teams. Self-hosted. AI-native. Yours to own.',
};

export default function PitbossPage() {
  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        {/* warm gradient glow behind hero */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-amber-500/[0.06] blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-orange-600/[0.04] blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-24 pb-20 relative">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.06] text-amber-400 text-xs font-medium tracking-wide uppercase mb-6">
              <Flame size={12} />
              Now accepting early customers
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Employee incentives<br />
              your crew will{' '}
              <span className="gradient-text-warm">actually use.</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
              Pitboss is a peer-voting incentive system built for rental yards, delivery
              fleets, and service teams. Self-hosted. AI-native. Yours to own.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:tim@gairiai.net?subject=Pitboss%20Demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-900/20"
              >
              <Mail size={16} /> Book a Demo
             </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-8">
          What makes Pitboss different
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="card-glow rounded-xl p-7">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
              <Users size={20} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-3">Peer Voting That Works</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Employees vote on each other weekly. Points accumulate. Top performers earn
              from a shared bonus pot tied to real sales. No manager gatekeeping&nbsp;&mdash;
              the team decides who gets recognized.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-glow rounded-xl p-7">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
              <Bot size={20} className="text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-3">AI That Actually Does Something</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Ships with a native MCP server and CLI. Ask your AI assistant who&apos;s
              trending, adjust points, run reports&nbsp;&mdash; in plain English. Works with
              Claude, ChatGPT, or your own local model.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-glow rounded-xl p-7">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
              <HardDrive size={20} className="text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-3">Your Data Stays in Your Building</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Single-tenant by design. Every customer gets their own SQLite database on
              their own hardware. No cloud dependency, no vendor lock-in, no monthly seat
              fees.
            </p>
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-8">
          Pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
          {/* Tier 1 */}
          <div className="card-glow rounded-xl p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Popular
            </div>
            <h3 className="text-xl font-black text-zinc-200 mb-1">Pitboss Pi</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-white">$399</span>
              <span className="text-sm text-zinc-600">one-time</span>
            </div>
            <p className="text-sm text-zinc-500 mb-5">
              + $29/mo optional support
            </p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#10003;</span>
                Raspberry Pi 4/5 bundle, pre-imaged
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#10003;</span>
                LAN-first — works without internet
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#10003;</span>
                Plug in, connect, start voting
              </li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div className="card-glow rounded-xl p-7">
            <h3 className="text-xl font-black text-zinc-200 mb-1">Pitboss BYO</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-white">$199</span>
              <span className="text-sm text-zinc-600">license</span>
            </div>
            <p className="text-sm text-zinc-500 mb-5">
              + $29/mo optional support
            </p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#10003;</span>
                Docker Compose, run on your hardware
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#10003;</span>
                Same software, your infrastructure
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#10003;</span>
                Full source access
              </li>
            </ul>
          </div>
        </div>

        {/* Early-bird callout */}
        <div className="mt-6 max-w-3xl">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-6 py-4">
            <p className="text-sm text-amber-300/90 font-medium">
              <span className="font-bold">First 3 customers:</span>{' '}
              free Pi + 90-day setup assistance in exchange for a case study.
            </p>
          </div>
        </div>
      </section>

      {/* ───── BUILT BY ───── */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="card-glow rounded-xl p-8 sm:p-10 max-w-3xl">
          <h2 className="text-2xl font-black text-zinc-200 mb-4">
            Built by a rental company,{' '}
            <span className="gradient-text-warm">for rental companies.</span>
          </h2>
          <div className="space-y-4 text-zinc-400 leading-relaxed">
            <p>
              Pitboss started as an internal tool at Broadway Tent &amp; Event in Minnesota.
              We built it for our own yard crew, ran it for months, then realized every
              10&ndash;50 employee service company has the same problem:
            </p>
            <p className="text-zinc-300 font-medium text-lg italic">
              How do you motivate people who aren&apos;t behind a desk?
            </p>
            <p>
              That&apos;s the question Pitboss answers. Not with another SaaS dashboard your
              crew will never open, but with a system they vote in themselves — on a device
              sitting in the break room.
            </p>
          </div>
          <div className="mt-8">
            <a
              href="mailto:tim@gairiai.net?subject=Pitboss%20Demo"
              className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors"
            >
              Let&apos;s talk <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
