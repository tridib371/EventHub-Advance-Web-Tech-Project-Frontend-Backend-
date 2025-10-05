
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Click on register</h1>
      <div className="space-y-4">
        <Link
          href="/register/customer"
          className="block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          Register as Customer
        </Link>
      </div>
    </div>
  );
}
