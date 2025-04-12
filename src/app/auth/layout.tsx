import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <Suspense fallback="Laoding...">
      {children}
      </Suspense>
    </main>
  );
}
