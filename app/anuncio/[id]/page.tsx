import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LISTINGS, getListing } from "@/lib/data";
import ListingDetail from "@/components/ListingDetail";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = getListing(id);
  return { title: l ? `${l.name} — Marketplace` : "Anúncio — Marketplace" };
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getListing(id)) notFound();
  return <ListingDetail id={id} />;
}
