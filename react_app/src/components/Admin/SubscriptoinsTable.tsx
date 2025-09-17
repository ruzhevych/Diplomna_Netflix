import {
  useGetAllSubscriptionsQuery,
  useDeleteSubscriptionMutation,
} from "../../services/adminSubscriptionsApi";


export default function SubscriptionsTable() {
  const { data: subs, isLoading, isError, error } = useGetAllSubscriptionsQuery();
  const [deleteSubscription] = useDeleteSubscriptionMutation();

  if (isLoading)
    return <div className="text-gray-400 text-lg text-center p-8">Loading...</div>;
  if (isError) {
    console.error(error);
    return <div className="text-red-500 text-lg text-center p-8">Error loading data.</div>;
  }

  if (!subs || subs.length === 0) {
    return <div className="text-gray-400 text-lg text-center p-8">No subscriptions available.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-700/30 text-gray-300">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Start Date</th>
            <th className="px-4 py-3">End Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {subs.map((s) => (
            <tr key={s.id} className="hover:bg-white/5">
              <td className="text-xs text-white/55 px-4 py-3">{s.id.substring(0, 8)}...</td>
              <td className="px-4 py-3">{s.userEmail}</td>
              <td className="px-4 py-3">{s.type}</td>
              <td className="px-4 py-3">{new Date(s.startDate).toLocaleDateString()}</td>
              <td className="px-4 py-3">{new Date(s.endDate).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-sm text-xs ${
                    s.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => {
                    if (window.confirm('Delete subscription?')) {
                      deleteSubscription(s.id);
                    }
                  }}
                  className="rounded-sm bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}