import { useState } from "react";
import { HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import { useCreateUserMutation, useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation, type AdminUser } from "../../app/api/users";

const emptyForm = { name: "", email: "", password: "", role: "admin" };

function UserModal({
  user,
  onClose,
}: {
  user: AdminUser | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState(
    user ? { name: user.name, email: user.email, password: "", role: user.role } : emptyForm
  );
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        const body: Record<string, string> = { name: form.name, email: form.email, role: form.role };
        if (form.password) body.password = form.password;
        await updateUser({ id: user.id, body }).unwrap();
        toast.success("User updated");
      } else {
        await createUser(form).unwrap();
        toast.success("User created");
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Operation failed");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
            <h2 className="text-lg font-semibold text-secondary-100">{user ? "Edit User" : "Create User"}</h2>
            <button onClick={onClose} className="text-secondary-300 hover:text-secondary-100"><HiXMark className="h-6 w-6" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {[
              { label: "Name", key: "name", type: "text", required: true },
              { label: "Email", key: "email", type: "email", required: true },
              { label: user ? "New Password (leave blank to keep)" : "Password", key: "password", type: "password", required: !user },
            ].map(({ label, key, type, required }) => (
              <div key={key}>
                <label className="mb-1 block text-sm font-semibold text-secondary-100">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={required}
                  className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-sm font-semibold text-secondary-100">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
              >
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={isLoading}
                className="flex-1 rounded bg-primary-700 px-4 py-2.5 text-sm font-semibold text-secondary-200 transition hover:bg-primary-600 disabled:opacity-50">
                {isLoading ? "Saving..." : user ? "Save Changes" : "Create User"}
              </button>
              <button type="button" onClick={onClose}
                className="rounded border border-secondary-300/30 px-4 py-2.5 text-sm font-semibold text-secondary-100 transition hover:bg-secondary-300/10">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function AdminUsers() {
  const { data, isLoading, isError } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; user: AdminUser | null }>({ open: false, user: null });
  const currentUser = useAppSelector((state) => state.auth.user);

  const users = data?.data ?? [];

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted");
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load users.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Admin Users</h1>
          <p className="mt-1 text-sm text-secondary-300">Manage who has access to the admin panel</p>
        </div>
        <button onClick={() => setModal({ open: true, user: null })}
          className="inline-flex items-center gap-2 rounded bg-primary-700 px-4 py-2.5 text-sm font-semibold text-secondary-200 transition hover:bg-primary-600">
          <HiPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <table className="w-full">
          <thead className="border-b border-secondary-300/30 bg-primary-800/5">
            <tr>
              {["Name", "Email", "Role", "Created", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-300/30">
            {users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-secondary-300">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="transition hover:bg-primary-800/5">
                  <td className="px-6 py-4 font-semibold text-secondary-100">
                    {user.name}
                    {user.id === currentUser?.id && (
                      <span className="ml-2 rounded-full bg-primary-700/10 px-2 py-0.5 text-xs text-primary-700">You</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.role === "super-admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-300">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ open: true, user })}
                        className="inline-flex items-center gap-1 rounded border border-secondary-300/30 px-3 py-2 text-xs font-semibold text-secondary-100 transition hover:bg-secondary-300/10">
                        <HiPencil className="h-4 w-4" /> Edit
                      </button>
                      {user.id !== currentUser?.id && (
                        <button onClick={() => handleDelete(user.id)} disabled={deletingId === user.id}
                          className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
                          <HiTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal.open && <UserModal user={modal.user} onClose={() => setModal({ open: false, user: null })} />}
    </div>
  );
}
