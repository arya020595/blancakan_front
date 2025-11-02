import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Dashboard",
  description: "Manage your events and their details",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
