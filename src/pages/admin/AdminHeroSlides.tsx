import { useRef, useState } from "react";
import { HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
  useCreateHeroSlideMutation,
  useDeleteHeroSlideMutation,
  useGetAllHeroSlidesQuery,
  useUpdateHeroSlideMutation,
  type HeroSlide,
} from "../../app/api/heroSlides";
import { Button } from "../../components";

interface FormState {
  type: "image" | "video";
  title: string;
  description: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel: string;
  secondaryLink: string;
  order: string;
  active: boolean;
}

const emptyForm: FormState = {
  type: "image",
  title: "",
  description: "",
  primaryLabel: "",
  primaryLink: "/portfolio",
  secondaryLabel: "",
  secondaryLink: "/contact",
  order: "0",
  active: true,
};

export default function AdminHeroSlides() {
  const { data, isLoading, isError } = useGetAllHeroSlidesQuery();
  const [createSlide, { isLoading: isSaving }] = useCreateHeroSlideMutation();
  const [updateSlide, { isLoading: isUpdating }] = useUpdateHeroSlideMutation();
  const [deleteSlide, { isLoading: isDeleting }] = useDeleteHeroSlideMutation();
  const isMutating = isSaving || isUpdating;

  const slides = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setMediaFile(null);
    setMediaPreview("");
    setIsModalOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setForm({
      type: slide.type,
      title: slide.title ?? "",
      description: slide.description ?? "",
      primaryLabel: slide.primaryLabel ?? "",
      primaryLink: slide.primaryLink ?? "/portfolio",
      secondaryLabel: slide.secondaryLabel ?? "",
      secondaryLink: slide.secondaryLink ?? "/contact",
      order: String(slide.order),
      active: slide.active,
    });
    setMediaFile(null);
    setMediaPreview(slide.image ?? slide.video ?? "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await deleteSlide(id).unwrap();
      toast.success("Slide deleted");
    } catch {
      toast.error("Failed to delete slide");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Reset media when type changes
    if (name === "type") {
      setMediaFile(null);
      setMediaPreview("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && !mediaFile) {
      toast.error(`Please select a${form.type === "video" ? " video" : "n image"}`);
      return;
    }
    const fd = new FormData();
    fd.append("type", form.type);
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("primaryLabel", form.primaryLabel);
    fd.append("primaryLink", form.primaryLink);
    fd.append("secondaryLabel", form.secondaryLabel);
    fd.append("secondaryLink", form.secondaryLink);
    fd.append("order", form.order);
    fd.append("active", String(form.active));
    if (mediaFile) fd.append(form.type, mediaFile);

    try {
      if (editing) {
        await updateSlide({ id: editing.id, body: fd }).unwrap();
        toast.success("Slide updated");
      } else {
        await createSlide(fd).unwrap();
        toast.success("Slide created");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save slide");
    }
  };

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load slides.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Hero Slides</h1>
          <p className="mt-1 text-sm text-secondary-300">Manage homepage hero section</p>
        </div>
        <Button onClick={openAdd} variant="secondary" className="flex items-center gap-2 rounded">
          <HiPlus className="h-5 w-5" /> Add Slide
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides.length === 0 ? (
          <p className="col-span-full py-12 text-center text-secondary-300">No slides yet.</p>
        ) : (
          slides.map((slide) => (
            <div key={slide.id} className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200">
              <div className="relative h-40 bg-primary-800/10">
                {slide.type === "video" ? (
                  <video src={slide.video} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={slide.image} alt={slide.title ?? ""} className="h-full w-full object-cover" />
                )}
                <div className="absolute left-2 top-2 flex gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${slide.type === "video" ? "bg-purple-600 text-white" : "bg-sky-600 text-white"}`}>
                    {slide.type}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${slide.active ? "bg-green-600 text-white" : "bg-secondary-300 text-secondary-100"}`}>
                    {slide.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-secondary-100 line-clamp-1">{slide.title || "(No title)"}</p>
                <p className="mt-1 text-xs text-secondary-300 line-clamp-2">{slide.description || "(No description)"}</p>
                <p className="mt-1 text-xs text-secondary-300">Order: {slide.order}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(slide)} className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-1.5 text-xs font-semibold text-secondary-200 hover:bg-primary-600">
                    <HiPencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(slide.id)} disabled={isDeleting} className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50">
                    <HiTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
              <div className="relative my-8 w-full max-w-2xl rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
                  <h2 className="text-xl font-semibold text-secondary-100">{editing ? "Edit Slide" : "Add Slide"}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary-300 hover:text-secondary-100"><HiXMark className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 p-6">

                  {/* Type */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Type *</label>
                    <select name="type" value={form.type} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none">
                      <option value="image">Image Slider</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  {/* Media upload */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      {form.type === "video" ? "Video" : "Image"} {!editing && "*"}
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept={form.type === "video" ? "video/*" : "image/*"}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button type="button" onClick={() => fileRef.current?.click()} className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10">
                      {mediaFile ? mediaFile.name : `Choose ${form.type}...`}
                    </button>
                    {mediaPreview && (
                      form.type === "video"
                        ? <video src={mediaPreview} className="mt-3 h-32 w-full rounded object-cover" muted />
                        : <img src={mediaPreview} className="mt-3 h-32 w-full rounded object-cover" />
                    )}
                  </div>

                  {/* Image-only fields */}
                  {form.type === "image" && (
                    <>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-secondary-100">Title</label>
                        <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="e.g. Business Cards" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-secondary-100">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="Short description..." />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-secondary-100">Primary Button Label</label>
                          <input type="text" name="primaryLabel" value={form.primaryLabel} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="e.g. Read More" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-secondary-100">Primary Button Link</label>
                          <input type="text" name="primaryLink" value={form.primaryLink} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="/portfolio" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-secondary-100">Secondary Button Label</label>
                          <input type="text" name="secondaryLabel" value={form.secondaryLabel} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="e.g. Contact Us" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-secondary-100">Secondary Button Link</label>
                          <input type="text" name="secondaryLink" value={form.secondaryLink} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="/contact" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Order</label>
                      <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="h-4 w-4 rounded" />
                        <span className="text-sm font-semibold text-secondary-100">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="secondary" className="flex-1 rounded" disabled={isMutating}>{isMutating ? "Saving..." : editing ? "Update" : "Add Slide"}</Button>
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
