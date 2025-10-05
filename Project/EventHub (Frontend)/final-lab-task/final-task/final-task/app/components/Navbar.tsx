import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-950 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold tracking-wide">
          EventHub
        </Link>

        <div className="space-x-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/customer/dashboard">Customer Dashboard</Link>
          <Link href="/login">Login</Link>
          {/* <Link href="/register/customer">Register</Link> */}
        </div>
      </div>
 </nav>
);
}
