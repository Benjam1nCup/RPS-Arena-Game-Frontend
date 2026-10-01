import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { STAKE_PRESETS } from "@/lib/constants";
import { formatRps } from "@/lib/utils";
import Link from "next/link";

const steps = [
  "Connect Wallet",
  "Get RPS",
  "Choose Your Stake",
  "Find an Opponent",
  "Choose Your Move",
  "Win the Match",
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="py-8 text-center sm:py-16">
        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          ROCK.
          <br />
          PAPER.
          <br />
          SCISSORS.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-text-secondary">
          Play real-time matches against other players.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/lobby">
            <Button className="min-w-[180px]">Play now</Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="secondary" className="min-w-[180px]">
              How it works
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-text-muted">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step}>
              <p className="text-2xl font-bold text-primary">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-semibold">{step}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center">
        <Card className="mx-auto max-w-lg">
          <p className="text-lg font-semibold">Rock beats scissors</p>
          <p className="text-lg font-semibold">Scissors beats paper</p>
          <p className="text-lg font-semibold">Paper beats rock</p>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold">Play with RPS</h2>
        <p className="mt-2 text-text-secondary">Choose your stake before every match.</p>
        <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          {STAKE_PRESETS.map((s) => (
            <div
              key={s}
              className="rounded-lg border border-border bg-surface-secondary py-4 font-semibold"
            >
              {formatRps(s)} RPS
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-primary/30 bg-primary/5 py-12 text-center">
        <h2 className="text-2xl font-bold">Ready to play?</h2>
        <Link href="/lobby" className="mt-6 inline-block">
          <Button>Play now</Button>
        </Link>
      </section>
    </div>
  );
}
