import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="text-3xl">Interrobang</h1>
      <p className="text-muted-foreground font-mono text-lg">
        Audience polls for Tangle
      </p>
      <Button asChild className="mt-4 rounded-2xl px-4 py-2">
        <Link href="/dashboard">
          Dashboard <ArrowRight className="ml-2" />
        </Link>
      </Button>
    </main>
  );
}
