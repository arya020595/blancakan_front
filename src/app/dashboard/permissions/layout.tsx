import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permissions | Dashboard",
  description: "Manage role permissions and access control",
};

export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
