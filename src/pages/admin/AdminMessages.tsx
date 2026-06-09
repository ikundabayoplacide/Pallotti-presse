import { useState } from "react";
import { HiEnvelope, HiEye, HiPhone, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
    useDeleteMessageMutation,
    useGetMessagesQuery,
    useMarkAsReadMutation,
    type Message,
} from "../../app/api/messages";
import { Button } from "../../components";

export default function AdminMessages() {
  const { data, isLoading, isError } = useGetMessagesQuery();
  const [markAsRead, { isLoading: isMarking }] = useMarkAsReadMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  const messages = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const handleView = async (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    if (!message.read) {
      try {
        await markAsRead(message.id).unwrap();
      } catch {
        // non-critical, ignore
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(id).unwrap();
      toast.success("Message deleted");
      if (selectedMessage?.id === id) setIsModalOpen(false);
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const filteredMessages =
    filterStatus === "All"
      ? messages
      : filterStatus === "New"
      ? messages.filter((m) => !m.read)
      : messages.filter((m) => m.read);

  const newCount = messages.filter((m) => !m.read).length;
  const readCount = messages.filter((m) => m.read).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return <p className="p-6 text-center text-red-500">Failed to load messages.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-secondary-100">Messages</h1>
        <p className="mt-1 text-sm text-secondary-300">Manage contact form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Total</p>
          <p className="mt-2 text-3xl font-semibold text-secondary-100">{messages.length}</p>
        </div>
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Unread</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{newCount}</p>
        </div>
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Read</p>
          <p className="mt-2 text-3xl font-semibold text-green-600">{readCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "New", "Read"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded px-4 py-2 text-sm font-semibold transition ${
              filterStatus === status
                ? "bg-primary-700 text-secondary-200"
                : "border border-secondary-300/30 text-secondary-100 hover:bg-primary-700/10"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Messages Table */}
      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-secondary-300/30 bg-primary-800/5">
              <tr>
                {["Name", "Contact", "Subject", "Message", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/30">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-secondary-300">No messages found.</td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className={`transition hover:bg-primary-800/5 ${!msg.read ? "bg-blue-50/30" : ""}`}>
                    <td className="px-6 py-4 font-semibold text-secondary-100">{msg.name}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-secondary-100">
                          <HiEnvelope className="h-4 w-4 text-secondary-300" />
                          <span className="truncate max-w-[180px]">{msg.email}</span>
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-2 text-sm text-secondary-100">
                            <HiPhone className="h-4 w-4 text-secondary-300" />
                            <span>{msg.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{msg.subject}</td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs text-sm text-secondary-100 line-clamp-2">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{formatDate(msg.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        msg.read ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {msg.read ? "Read" : "New"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(msg)}
                          disabled={isMarking}
                          className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600 disabled:opacity-50"
                        >
                          <HiEye className="h-4 w-4" /> {isMarking ? "..." : "View"}
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                        >
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

      {/* View Message Modal */}
      {isModalOpen && selectedMessage && (
        <>
          <div className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 sm:p-6 lg:p-8">
              <div className="relative my-8 w-full max-w-2xl rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
                  <h2 className="text-xl font-semibold text-secondary-100">Message Details</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary-300 transition hover:text-secondary-100">
                    <HiXMark className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-secondary-300">Name</label>
                      <p className="text-base font-semibold text-secondary-100">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-secondary-300">Date</label>
                      <p className="text-base text-secondary-100">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-secondary-300">Email</label>
                      <a href={`mailto:${selectedMessage.email}`} className="text-base text-primary-700 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-secondary-300">Phone</label>
                        <a href={`tel:${selectedMessage.phone}`} className="text-base text-primary-700 hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-secondary-300">Subject</label>
                    <p className="text-base text-secondary-100">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-secondary-300">Message</label>
                    <div className="rounded border border-secondary-300/30 bg-style-600/30 p-4">
                      <p className="text-base leading-7 text-secondary-100">{selectedMessage.message}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => window.open(`mailto:${selectedMessage.email}`, "_blank")} variant="secondary" className="flex-1 rounded">
                      Reply via Email
                    </Button>
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded">Close</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
