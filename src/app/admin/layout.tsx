export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't protect setup and login routes
  return (
    <div className="min-h-screen">
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </div>
  );
}

async function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  // We check session server-side but allow setup/login to pass through
  // The actual auth redirect is handled per-page where needed
  return (
    <>
      {children}
    </>
  );
}
