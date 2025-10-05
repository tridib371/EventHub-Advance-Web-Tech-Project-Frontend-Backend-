
type Props = { params: { id: string } };

export default async function CustomerDetail({ params }: Props) {
  const res = await fetch(`http://localhost:4000/customer/${params.id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        Customer not found.
      </div>
    );
  }

  const c = await res.json();

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-2">Customer #{c.id}</h1>
      <p><strong>Name:</strong> {c.name}</p>
      <p><strong>Email:</strong> {c.email}</p>

      {c.profile && (
        <>
          <p className="mt-2 font-medium">Profile</p>
          <p><strong>Address:</strong> {c.profile.address}</p>
          <p><strong>Phone:</strong> {c.profile.phone}</p>
        </>
      )}
 </div>
);
}
