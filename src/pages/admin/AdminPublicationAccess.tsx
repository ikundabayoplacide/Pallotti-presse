import { useState } from "react";
import { HiCheckCircle, HiClipboard, HiTrash, HiXCircle } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
  useDeleteRequestMutation,
  useGetAllRequestsQuery,
  useGrantAccessMutation,
  useRejectAccessMutation,
} from "../../app/api/publicationAccess";

export default function AdminPublicationAccess() {
  const { data, isLoading, isError } = useGetAllRequestsQuery();
  const [grantAccess, { isLoading: isGranting }] = useGrantAccessMutation();
  const [rejectAccess, { isLoading: isRejecting }] = useRejectAccessMutation();
  const [deleteRequest] = useDeleteRequestMutation();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const requests = data?.data ?? [];
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const handleGrant = async (id: string) => {
    try {
      const res = await grantAccess(id).unwrap();
      const frontendUrl = window.location.origin;
      const accessLink = `${frontendUrl}/publications/${res.data.publicationId}?token=${res.token}`;
      await navigator.clipboard.writeText(accessLink);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 3000);
      toast.success("Access granted! Link copied to clipboard — share it with the user.");
    } catch {
      toast.error("Failed to grant access");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Reject this request?")) return;
    try {
      await rejectAccess(id).unwrap();
      toast.success("Request rejected");
    } catch {
      toast.error("Failed to reject request");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this request?")) return;
    setDeletingId(id);
    try {
      await deleteRequest(id).unwrap();
      toast.success("Request deleted");
    } catch {
      toast.error("Failed to delete request");
    } finally {
      setDeletingId(null);
    }
  };

  const copyLink = async (req: typeof requests[0]) => {
    if (!req.accessToken) return;
    const frontendUrl = window.location.origin;
    const link = `${frontendUrl}/publications/${req.publicationId}?token=${req.accessToken}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(req.id);
    setTimeout(() => setCopiedId(null), 3000);
    toast.success("Access link copied!");
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load access requests.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-100">Publication Access Requests</h1>
        <p className="mt-1 text-sm text-secondary-300">Review MoMo payment requests and grant access</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total", value: requests.length, color: "text-secondary-100" },
          { label: "Pending", value: requests.filter((r) => r.status === "pending").length, color: "text-yellow-600" },
          { label: "Approved", value: requests.filter((r) => r.status === "approved").length, color: "text-green-600" },
          { label: "Rejected", value: requests.filter((r) => r.status === "rejected").length, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
            <p className="text-sm text-secondary-300">{s.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded px-4 py-2 text-sm font-semibold capitalize transition ${filter === f ? "bg-primary-700 text-secondary-200" : "border border-secondary-300/30 text-secondary-100 hover:bg-primary-700/10"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-secondary-300/30 bg-primary-800/5">
              <tr>
                {["Publication", "Email", "Transaction ID", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/30">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-secondary-300">No requests found.</td></tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="transition hover:bg-primary-800/5">
                    <td className="px-6 py-4 font-semibold text-secondary-100 max-w-[160px] truncate">
                      {req.publication?.title ?? req.publicationId}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{req.email}</td>
                    <td className="px-6 py-4 text-sm text-secondary-300 font-mono">{req.transactionId}</td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{formatDate(req.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        req.status === "approved" ? "bg-green-100 text-green-800"
                        : req.status === "rejected" ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === "pending" && (
                          <>
                            <button onClick={() => handleGrant(req.id)} disabled={isGranting}
                              className="inline-flex items-center gap-1 rounded border border-green-300 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-50">
                              <HiCheckCircle className="h-4 w-4" /> Grant
                            </button>
                            <button onClick={() => handleReject(req.id)} disabled={isRejecting}
                              className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
                              <HiXCircle className="h-4 w-4" /> Reject
                            </button>
                          </>
                        )}
                        {req.status === "approved" && req.accessToken && (
                          <button onClick={() => copyLink(req)}
                            className={`inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-semibold transition ${copiedId === req.id ? "bg-green-600 text-white" : "bg-primary-700 text-secondary-200 hover:bg-primary-600"}`}>
                            <HiClipboard className="h-4 w-4" />
                            {copiedId === req.id ? "Copied!" : "Copy Link"}
                          </button>
                        )}
                        <button onClick={() => handleDelete(req.id)} disabled={deletingId === req.id}
                          className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
