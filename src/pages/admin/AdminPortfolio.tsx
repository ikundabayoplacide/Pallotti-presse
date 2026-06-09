import { useRef, useState } from "react";
import { HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
    useCreatePortfolioItemMutation,
    useDeletePortfolioItemMutation,
    useGetPortfolioItemsQuery,
    useUpdatePortfolioItemMutation,
    type PortfolioItem,
} from "../../app/api/portfolio";
import { Button } from "../../components";

const categories = ["Business Printing", "Packaging", "Marketing", "Publications"];

interface FormState {
  title: string;
  category: string;
  description: string;
  featured: boolean;
}

const emptyForm: FormState = {
  title: "",
  category: "Business Printing",
  description: "",
  featured: false,
};

export default function AdminPortfolio() {
  const { data, isLoading, isError } = useGetPortfolioItemsQuery();
  const [createItem, { isLoading: isSaving }] = useCreatePortfolioItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdatePortfolioItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeletePortfolioItemMutation();
  const isMutating = isSaving || isUpdating;

  const portfolio = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({ title: item.title, category: item.category, description: item.description, featured: item.featured });
    setImageFile(null);
    setImagePreview(item.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this portfolio item?")) return;
    try {
      await deleteItem(id).unwrap();
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem && !imageFile) {
      toast.error("Please select an image");
      return;
    }

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("category", formData.category);
    fd.append("description", formData.description);
    fd.append("featured", String(formData.featured));
    if (imageFile) fd.append("image", imageFile);

    try {
      if (editingItem) {
        await updateItem({ id: editingItem.id, body: fd }).unwrap();
        toast.success("Item updated");
      } else {
        await createItem(fd).unwrap();
        toast.success("Item created");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save item");
    }
  };

  const filtered = filterCategory === "All" ? portfolio : portfolio.filter((i) => i.category === filterCategory);

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load portfolio.</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Portfolio</h1>
          <p className="mt-1 text-sm text-secondary-300">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleAdd} variant="secondary" className="flex items-center gap-2 rounded">
          <HiPlus className="h-5 w-5" /> Add Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total", value: portfolio.length, color: "text-secondary-100" },
          { label: "Featured", value: portfolio.filter((i) => i.featured).length, color: "text-primary-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
            <p className="text-sm text-secondary-300">{s.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded px-4 py-2 text-sm font-semibold transition ${
              filterCategory === cat ? "bg-primary-700 text-secondary-200" : "border border-secondary-300/30 text-secondary-100 hover:bg-primary-700/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-secondary-300/30 bg-primary-800/5">
              <tr>
                {["Image", "Title", "Category", "Description", "Featured", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/30">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-secondary-300">No items found.</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="transition hover:bg-primary-800/5">
                    <td className="px-6 py-4">
                      <img src={item.image} alt={item.title} className="h-16 w-16 rounded object-cover" />
                    </td>
                    <td className="px-6 py-4 font-semibold text-secondary-100">{item.title}</td>
                    <td className="px-6 py-4 text-xs tracking-[0.12em] uppercase text-primary-700">{item.category}</td>
                    <td className="px-6 py-4 max-w-xs text-sm text-secondary-100 line-clamp-2">{item.description}</td>
                    <td className="px-6 py-4">
                      {item.featured
                        ? <span className="inline-flex rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-secondary-200">Yes</span>
                        : <span className="text-sm text-secondary-300">No</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600">
                          <HiPencil className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} disabled={isDeleting} className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
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
                  <h2 className="text-xl font-semibold text-secondary-100">{editingItem ? "Edit Project" : "Add New Project"}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary-300 transition hover:text-secondary-100"><HiXMark className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="Project title" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none">
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="Project description..." />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Image {!editingItem && "*"}</label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10">
                      {imageFile ? imageFile.name : "Choose image..."}
                    </button>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 h-32 w-full rounded object-cover" />}
                  </div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-secondary-300/30 text-primary-700" />
                    <span className="text-sm font-semibold text-secondary-100">Featured Project</span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="secondary" className="flex-1 rounded" disabled={isMutating}>{isMutating ? "Saving..." : editingItem ? "Update" : "Add Project"}</Button>
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
