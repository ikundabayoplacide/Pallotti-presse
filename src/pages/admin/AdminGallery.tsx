import { useRef, useState } from "react";
import { HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
    useCreateImageMutation,
    useDeleteImageMutation,
    useGetAllImagesQuery,
    useUpdateImageMutation,
    type GalleryImage,
} from "../../app/api/gallery";
import { Button } from "../../components";

interface FormState {
  title: string;
  category: string;
  featured: boolean;
  order: number;
  published: boolean;
}

const emptyForm: FormState = {
  title: "",
  category: "General",
  featured: false,
  order: 0,
  published: true,
};

const categories = ["General", "Business Printing", "Packaging", "Marketing", "Events", "Products", "Other"];

export default function AdminGallery() {
  const { data, isLoading, isError } = useGetAllImagesQuery();
  const [createImage] = useCreateImageMutation();
  const [updateImage] = useUpdateImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const images = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    setEditingImage(null);
    setFormData({ ...emptyForm, order: images.length });
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setFormData({
      title: img.title ?? "",
      category: img.category,
      featured: img.featured,
      order: img.order,
      published: img.published,
    });
    setImageFile(null);
    setImagePreview(img.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteImage(id).unwrap();
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage && !imageFile) {
      toast.error("Please select an image");
      return;
    }

    const fd = new FormData();
    if (formData.title) fd.append("title", formData.title);
    fd.append("category", formData.category);
    fd.append("featured", String(formData.featured));
    fd.append("order", String(formData.order));
    fd.append("published", String(formData.published));
    if (imageFile) fd.append("image", imageFile);

    try {
      if (editingImage) {
        await updateImage({ id: editingImage.id, body: fd }).unwrap();
        toast.success("Image updated");
      } else {
        await createImage(fd).unwrap();
        toast.success("Image uploaded");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to save image");
    }
  };

  const allCategories = ["All", ...Array.from(new Set(images.map((img) => img.category)))];
  const filtered = filterCategory === "All" ? images : images.filter((img) => img.category === filterCategory);

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load gallery.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Gallery</h1>
          <p className="mt-1 text-sm text-secondary-300">Manage images shown on the Gallery page</p>
        </div>
        <Button onClick={handleAdd} variant="secondary" className="flex items-center gap-2 rounded">
          <HiPlus className="h-5 w-5" /> Upload Image
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total", value: images.length, color: "text-secondary-100" },
          { label: "Published", value: images.filter((i) => i.published).length, color: "text-green-600" },
          { label: "Hidden", value: images.filter((i) => !i.published).length, color: "text-yellow-600" },
          { label: "Featured", value: images.filter((i) => i.featured).length, color: "text-primary-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
            <p className="text-sm text-secondary-300">{s.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded px-4 py-2 text-sm font-semibold transition ${
              filterCategory === cat
                ? "bg-primary-700 text-secondary-200"
                : "border border-secondary-300/30 text-secondary-100 hover:bg-primary-700/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-secondary-300">No images found. Upload your first image.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-secondary-300/20 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="aspect-square overflow-hidden">
                <img src={img.image} alt={img.title ?? img.category} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>

              {/* Status badges */}
              <div className="absolute left-2 top-2 flex gap-1">
                {img.featured && <span className="rounded-full bg-primary-700 px-2 py-0.5 text-xs font-semibold text-secondary-200">Featured</span>}
                {!img.published && <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-semibold text-white">Hidden</span>}
              </div>

              {/* Actions overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-secondary-100/0 opacity-0 transition-all duration-300 group-hover:bg-secondary-100/50 group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(img)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 text-secondary-200 shadow transition hover:bg-primary-600"
                >
                  <HiPencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow transition hover:bg-red-700"
                >
                  <HiTrash className="h-4 w-4" />
                </button>
              </div>

              {/* Caption */}
              {img.title && (
                <div className="border-t border-secondary-300/20 px-3 py-2">
                  <p className="truncate text-xs font-semibold text-secondary-100">{img.title}</p>
                  <p className="text-xs text-secondary-300">{img.category}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 sm:p-6 lg:p-8">
              <div className="relative my-8 w-full max-w-lg rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
                  <h2 className="text-xl font-semibold text-secondary-100">{editingImage ? "Edit Image" : "Upload Image"}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary-300 transition hover:text-secondary-100"><HiXMark className="h-6 w-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                  {/* Image picker */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      Image {!editingImage && "*"}
                    </label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10">
                      {imageFile ? imageFile.name : "Choose image..."}
                    </button>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="mt-3 aspect-video w-full rounded object-cover" />
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Caption <span className="font-normal text-secondary-300">(optional)</span></label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="Image caption" />
                  </div>

                  {/* Category & Order */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Category *</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none">
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Display Order</label>
                      <input type="number" name="order" value={formData.order} onChange={handleChange} min={0} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" />
                      <p className="mt-1 text-xs text-secondary-300">Lower = appears first</p>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="h-4 w-4 rounded border-secondary-300/30 text-primary-700" />
                      <span className="text-sm font-semibold text-secondary-100">Published</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-secondary-300/30 text-primary-700" />
                      <span className="text-sm font-semibold text-secondary-100">Featured</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="secondary" className="flex-1 rounded">{editingImage ? "Update" : "Upload"}</Button>
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
