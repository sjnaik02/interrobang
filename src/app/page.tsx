import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl">Interrobang</h1>
      <p className="font-mono text-lg text-muted-foreground">
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
