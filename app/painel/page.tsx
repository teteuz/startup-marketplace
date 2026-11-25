import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = { title: "Painel — Marketplace" };

export default function PainelPage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
