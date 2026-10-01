import { Card } from "@/components/common/Card";
import Link from "next/link";
import { Button } from "@/components/common/Button";

const steps = [
  ["Connect", "Connect your wallet."],
  ["Get RPS", "Buy RPS directly inside RPS Arena."],
  ["Choose a stake", "Choose how much RPS you want to play."],
  ["Find a player", "Use Quick Match or join a room."],
  ["Choose your move", "Rock, Paper, or Scissors."],
  ["Reveal", "Both moves are revealed simultaneously."],
  ["Win", "The winner receives the prize after the platform fee."],
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold">How to play</h1>
      <div className="space-y-4">
        {steps.map(([title, body], i) => (
          <Card key={title} className="flex gap-4">
            <span className="text-2xl font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-semibold uppercase tracking-wide">{title}</h2>
              <p className="mt-1 text-text-secondary">{body}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <p className="font-semibold">Rock beats scissors</p>
        <p className="font-semibold">Scissors beats paper</p>
        <p className="font-semibold">Paper beats rock</p>
      </Card>
      <Link href="/lobby">
        <Button>Play now</Button>
      </Link>
    </div>
  );
}
