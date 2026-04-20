import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-4">Access Denied</h1>
      <p className="text-slate-500 mb-6">
        You don&apos;t have permission to view this page.
      </p>
      <Link href="/" className="text-orange-500 hover:underline">
        Go back home
      </Link>
    </div>
  )
}
