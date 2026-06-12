import { useRef, useState } from "react";
import { HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
  type Department,
} from "../../app/api/departments";
import { Button } from "../../components";

interface FormState {
  name: string;
  description: string;
}

const emptyForm: FormState = { name: "", description: "" };

export default function AdminDepartments() {
  const { data, isLoading, isError } = useGetDepartmentsQuery();
  const [createDepartment, { isLoading: isSaving }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();
  const isMutating = isSaving || isUpdating;

  const departments = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    setEditingDepartment(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({ name: dept.name, description: dept.description });
    setImageFile(null);
    setImagePreview(dept.image ?? "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await deleteDepartment(id).unwrap();
      toast.success("Department deleted");
    } catch {
      toast.error("Failed to delete department");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    if (imageFile) fd.append("image", imageFile);

    try {
      if (editingDepartment) {
        await updateDepartment({ id: editingDepartment.id, body: fd }).unwrap();
        toast.success("Department updated");
      } else {
        await createDepartment(fd).unwrap();
        toast.success("Department created");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to save department");
    }
  };

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load departments.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Departments</h1>
          <p className="mt-1 text-sm text-secondary-300">Manage your departments</p>
        </div>
        <Button onClick={handleAdd} variant="secondary" className="flex items-center gap-2 rounded">
          <HiPlus className="h-5 w-5" /> Add Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Total</p>
          <p className="mt-2 text-3xl font-semibold text-secondary-100">{departments.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-secondary-300/30 bg-primary-800/5">
              <tr>
                {["Image", "Name", "Description", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/30">
              {departments.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-secondary-300">No departments found.</td></tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.id} className="transition hover:bg-primary-800/5">
                    <td className="px-6 py-4">
                      {dept.image
                        ? <img src={dept.image} alt={dept.name} className="h-16 w-16 rounded object-cover" />
                        : <div className="h-16 w-16 rounded bg-secondary-300/20 flex items-center justify-center text-xs text-secondary-300">No image</div>
                      }
                    </td>
                    <td className="px-6 py-4 font-semibold text-secondary-100">{dept.name}</td>
                    <td className="px-6 py-4 max-w-xs text-sm text-secondary-100 line-clamp-2">{dept.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(dept)} className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600">
                          <HiPencil className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => handleDelete(dept.id)} disabled={isDeleting} className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
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

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 sm:p-6 lg:p-8">
              <div className="relative my-8 w-full max-w-2xl rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
                  <h2 className="text-xl font-semibold text-secondary-100">{editingDepartment ? "Edit Department" : "Add New Department"}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary-300 transition hover:text-secondary-100"><HiXMark className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="e.g., Design Department" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="Department description..." />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Image (optional)</label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10">
                      {imageFile ? imageFile.name : "Choose image..."}
                    </button>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 h-32 w-full rounded object-cover" />}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="secondary" className="flex-1 rounded" disabled={isMutating}>{isMutating ? "Saving..." : editingDepartment ? "Update" : "Add Department"}</Button>
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded">Cancel</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
