import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Props = { params: { id: string } };

export default async function ProfilePage({ params }: Props) {
  const id = params.id; // string, no await

  // ✅ Await cookies() because it is async
  const cookieStore = await cookies(); 
  const sessionCookie = cookieStore.get('connect.sid'); 

  if (!sessionCookie) {
    redirect('/login');
  }

  const res = await fetch(`http://localhost:4000/customer/${id}/profile`, {
    cache: 'no-store',
    headers: {
      cookie: `session=${sessionCookie.value}`, // send session for auth
    },
  });

  if (!res.ok) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        No profile found for this customer.
      </div>
    );
  }

  const profile = await res.json();

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-2">Profile of Customer #{id}</h1>
      <p><strong>Address:</strong> {profile.address}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
    </div>
  );
}
