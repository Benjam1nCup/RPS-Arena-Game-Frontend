import { BrandAvatar } from "@/components/brand/BrandAvatar";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { STAKE_PRESETS } from "@/lib/constants";
import { formatRps } from "@/lib/utils";
import Link from "next/link";

const callouts = [
  { id: "pvp", text: "PLAYER VS\nPLAYER!", className: "left-0 top-[8%] -rotate-6" },
  { id: "stake", text: "PICK YOUR\nSTAKE!", className: "right-0 top-[12%] rotate-6" },
  { id: "web3", text: "WEB3\nWALLET!", className: "right-[-4%] top-[55%] rotate-3" },
  { id: "fast", text: "REAL-TIME\nMATCHES!", className: "left-[-2%] bottom-[18%] -rotate-3" },
  { id: "retro", text: "IT'S LIKE\n2009!", className: "left-[20%] bottom-[4%] rotate-2" },
];

const howSteps = [
  {
    n: 1,
    title: "How to play",
    body: "Connect your wallet, get RPS, choose a stake, and find an opponent.",
    note: "Quick match or join a public room.",
    tone: "dark" as const,
  },
  {
    n: 2,
    title: "But",
    body: "Rock beats scissors. Scissors beats paper. Paper beats rock.",
    note: "Both moves reveal at the same time.",
    tone: "light" as const,
  },
  {
    n: 3,
    title: "That's RPS Arena",
    body: "Win the pot minus a small platform fee. Play again with the same stake.",
    note: "Mock wallet + matchmaking for this MVP.",
    tone: "dark" as const,
  },
];

const also = [
  "It's Rock Paper Scissors — not a crossword. One move per round.",
  "Wrong purchase? Retry. Failed match? Pick another stake.",
  "Draws return your stake.",
  "Blockchain details stay behind the scenes until you need them.",
  "Built for fast rematches.",
];

export default function HomePage() {
  return (
    <div className="relative space-y-20 pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-[12%] z-0 hidden select-none sm:block">
        <p className="sixtep-huge-title opacity-[0.14]">rps arena</p>
      </div>

      <section className="relative z-[1] pt-4 text-center sm:pt-8">
        <div className="relative mx-auto max-w-md">
          {callouts.map((c) => (
            <p
              key={c.id}
              className={`sixtep-callout absolute hidden whitespace-pre-line sm:block ${c.className}`}
            >
              {c.text}
            </p>
          ))}

          <div className="sixtep-dot-frame mx-auto max-w-[340px] p-3">
            <BrandAvatar size="hero" className="max-w-none border-4 shadow-[8px_8px_0_rgba(0,0,0,0.2)]" />
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-md text-base sm:text-lg">
          Real-time Rock Paper Scissors against other players. Simple screen. Serious stakes.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/lobby">
            <Button className="min-w-[200px]">👏 Play now 👏</Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="secondary" className="min-w-[200px]">
              How it works
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-16">
        {howSteps.map((step) => (
          <div key={step.n} className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <p className="sixtep-progress-num shrink-0 sm:w-[28vw] sm:text-right">
              <span>{step.n}</span>/3
            </p>
            <Card tone={step.tone} className="w-full max-w-3xl flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.15em] opacity-80">{step.title}</p>
              <p className="mt-4 text-lg font-medium leading-tight sm:text-xl">{step.body}</p>
              <p className="sixtep-also-item mt-4 text-sm opacity-90">{step.note}</p>
            </Card>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-center font-display text-5xl font-black uppercase text-white [text-shadow:_2px_2px_0_#2D2A27] sm:text-7xl">
          Also
        </h2>
        <ul className="mx-auto mt-10 max-w-2xl space-y-10">
          {also.map((line, i) => (
            <li
              key={line}
              className="sixtep-also-item"
              style={{ transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)` }}
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="text-center">
        <Card framed={false} tone="light" className="mx-auto max-w-lg">
          <p className="text-lg font-bold">Rock beats scissors</p>
          <p className="text-lg font-bold">Scissors beats paper</p>
          <p className="text-lg font-bold">Paper beats rock</p>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="font-display text-2xl font-black uppercase">Play with RPS</h2>
        <p className="mt-2 opacity-70">Choose your stake before every match.</p>
        <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          {STAKE_PRESETS.map((s) => (
            <div key={s} className="rounded-2xl border-2 border-black bg-white py-4 font-bold">
              {formatRps(s)} RPS
            </div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <Link href="/lobby">
          <Button className="min-w-[240px] text-base">Play now</Button>
        </Link>
      </section>
    </div>
  );
}
