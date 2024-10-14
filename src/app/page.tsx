import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="text-3xl">Interrobang</h1>
      <p className="text-muted-foreground font-mono text-lg">
        Audience polls for Tangle
      </p>
      <Link href="/dashboard">Get Started</Link>
    </main>
  );
}
