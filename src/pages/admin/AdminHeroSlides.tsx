import { useRef, useState } from "react";
import { HiFilm, HiPhoto, HiPencil, HiPlus, HiTrash, HiXMark, HiRectangleStack } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
  useCreateHeroSlideMutation,
  useDeleteHeroSlideMutation,
  useGetAllHeroSlidesQuery,
  useUpdateHeroSlideMutation,
  type HeroSlide,
} from "../../app/api/heroSlides";
import { Button } from "../../components";

type Role = "background" | "video" | "slide";

interface FormState {
  role: Role;
  title: string;
  description: string;
  primaryLabel: string;
  primaryLink: string;
  order: string;
  active: boolean;
}

const emptyForm = (role: Role): FormState => ({
  role,
  title: "",
  description: "",
  primaryLabel: "",
  primaryLink: "/portfolio",
  order: "0",
  active: true,
});

function SlideModal({
  role,
  editing,
  onClose,
}: {
  role: Role;
  editing: HeroSlide | null;
  onClose: () => void;
}) {
  const [createSlide, { isLoading: isSaving }] = useCreateHeroSlideMutation();
  const [updateSlide, { isLoading: isUpdating }] = useUpdateHeroSlideMutation();
  const isMutating = isSaving || isUpdating;

  const [form, setForm] = useState<FormState>(
    editing
      ? {
          role: editing.role,
          title: editing.title ?? "",
          description: editing.description ?? "",
          primaryLabel: editing.primaryLabel ?? "",
          primaryLink: editing.primaryLink ?? "/portfolio",
          order: String(editing.order),
          active: editing.active,
        }
      : emptyForm(role)
  );
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState(
    editing ? (editing.image ?? editing.video ?? "") : ""
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && !mediaFile) {
      toast.error(`Please select a${role === "video" ? " video" : "n image"}`);
      return;
    }
    const fd = new FormData();
    fd.append("role", form.role);
    fd.append("active", String(form.active));
    fd.append("order", form.order);
    if (role === "slide") {
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("primaryLabel", form.primaryLabel);
      fd.append("primaryLink", form.primaryLink);
    }
    if (mediaFile) fd.append(role === "video" ? "video" : "image", mediaFile);

    try {
      if (editing) {
        await updateSlide({ id: editing.id, body: fd }).unwrap();
        toast.success("Updated successfully");
      } else {
        await createSlide(fd).unwrap();
        toast.success("Created successfully");
      }
      onClose();
    } catch {
      toast.error("Failed to save");
    }
  };

  const titles: Record<Role, string> = {
    background: editing ? "Edit Background Image" : "Set Background Image",
    video: editing ? "Edit Video" : "Add Video",
    slide: editing ? "Edit Content Slide" : "Add Content Slide",
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
          <div className="relative my-8 w-full max-w-xl rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
              <h2 className="text-xl font-semibold text-secondary-100">{titles[role]}</h2>
              <button onClick={onClose} className="text-secondary-300 hover:text-secondary-100"><HiXMark className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {/* Media */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary-100">
                  {role === "video" ? "Video" : "Image"} {!editing && "*"}
                </label>
                <input ref={fileRef} type="file" accept={role === "video" ? "video/*" : "image/*"} onChange={handleFile} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10">
                  {mediaFile ? mediaFile.name : `Choose ${role === "video" ? "video" : "image"}...`}
                </button>
                {mediaPreview && (
                  role === "video"
                    ? <video src={mediaPreview} className="mt-3 h-36 w-full rounded object-cover" muted />
                    : <img src={mediaPreview} alt="" className="mt-3 h-36 w-full rounded object-cover" />
                )}
              </div>

              {/* Slide-only fields */}
              {role === "slide" && (
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
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Button Label</label>
                      <input type="text" name="primaryLabel" value={form.primaryLabel} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="e.g. Read More" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Button Link</label>
                      <input type="text" name="primaryLink" value={form.primaryLink} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="/portfolio" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Order</label>
                    <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" />
                  </div>
                </>
              )}

              <label className="flex items-center gap-3">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="h-4 w-4 rounded" />
                <span className="text-sm font-semibold text-secondary-100">Active</span>
              </label>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="secondary" className="flex-1 rounded" disabled={isMutating}>
                  {isMutating ? "Saving..." : editing ? "Update" : "Save"}
                </Button>
                <Button type="button" variant="ghost" onClick={onClose} className="rounded">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminHeroSlides() {
  const { data, isLoading, isError } = useGetAllHeroSlidesQuery();
  const [deleteSlide, { isLoading: isDeleting }] = useDeleteHeroSlideMutation();

  const [modal, setModal] = useState<{ role: Role; editing: HeroSlide | null } | null>(null);

  const slides = data?.data ?? [];
  const background = slides.filter((s) => s.role === "background");
  const videos = slides.filter((s) => s.role === "video");
  const contentSlides = slides.filter((s) => s.role === "slide");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteSlide(id).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load hero slides.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-100">Hero Section</h1>
        <p className="mt-1 text-sm text-secondary-300">Manage the homepage hero — background, video card, and content slides independently</p>
      </div>

      {/* ── Background Image ── */}
      <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiPhoto className="h-5 w-5 text-primary-700" />
            <h2 className="text-lg font-semibold text-secondary-100">Background Image</h2>
            <span className="text-xs text-secondary-300">(fixed, full-width behind everything)</span>
          </div>
          <Button onClick={() => setModal({ role: "background", editing: null })} variant="secondary" className="flex items-center gap-2 rounded text-xs">
            <HiPlus className="h-4 w-4" /> {background.length > 0 ? "Replace" : "Set Image"}
          </Button>
        </div>
        {background.length === 0 ? (
          <p className="text-sm text-secondary-300">No background image set. Using static fallback.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {background.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-secondary-300/20">
                <img src={item.image} alt="" className="h-36 w-full object-cover" />
                <div className="flex items-center justify-between p-3">
                  <span className={`text-xs font-semibold ${item.active ? "text-green-600" : "text-secondary-300"}`}>{item.active ? "Active" : "Inactive"}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setModal({ role: "background", editing: item })} className="rounded bg-primary-700 px-2.5 py-1.5 text-xs font-semibold text-secondary-200 hover:bg-primary-600">
                      <HiPencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={isDeleting} className="rounded border border-red-300 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50">
                      <HiTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Video Card ── */}
      <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiFilm className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-secondary-100">Left Card — Video</h2>
            <span className="text-xs text-secondary-300">(shown in the left floating card)</span>
          </div>
          <Button onClick={() => setModal({ role: "video", editing: null })} variant="secondary" className="flex items-center gap-2 rounded text-xs">
            <HiPlus className="h-4 w-4" /> Add Video
          </Button>
        </div>
        {videos.length === 0 ? (
          <p className="text-sm text-secondary-300">No video added. The left card will show the background image.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-secondary-300/20">
                <video src={item.video} className="h-36 w-full object-cover" muted />
                <div className="flex items-center justify-between p-3">
                  <span className={`text-xs font-semibold ${item.active ? "text-green-600" : "text-secondary-300"}`}>{item.active ? "Active" : "Inactive"}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setModal({ role: "video", editing: item })} className="rounded bg-primary-700 px-2.5 py-1.5 text-xs font-semibold text-secondary-200 hover:bg-primary-600">
                      <HiPencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={isDeleting} className="rounded border border-red-300 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50">
                      <HiTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Content Slides ── */}
      <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiRectangleStack className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-secondary-100">Right Card — Content Slides</h2>
            <span className="text-xs text-secondary-300">(each has image, title, description, button)</span>
          </div>
          <Button onClick={() => setModal({ role: "slide", editing: null })} variant="secondary" className="flex items-center gap-2 rounded text-xs">
            <HiPlus className="h-4 w-4" /> Add Slide
          </Button>
        </div>
        {contentSlides.length === 0 ? (
          <p className="text-sm text-secondary-300">No content slides. Using static fallback slides.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contentSlides.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-secondary-300/20">
                {item.image && <img src={item.image} alt={item.title ?? ""} className="h-36 w-full object-cover" />}
                <div className="p-4">
                  <p className="font-semibold text-secondary-100 line-clamp-1">{item.title || "(No title)"}</p>
                  <p className="mt-1 text-xs text-secondary-300 line-clamp-2">{item.description || "(No description)"}</p>
                  {item.primaryLabel && (
                    <p className="mt-1 text-xs text-primary-700">Button: {item.primaryLabel} → {item.primaryLink}</p>
                  )}
                  <p className="mt-1 text-xs text-secondary-300">Order: {item.order}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setModal({ role: "slide", editing: item })} className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-1.5 text-xs font-semibold text-secondary-200 hover:bg-primary-600">
                      <HiPencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={isDeleting} className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50">
                      <HiTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <SlideModal
          role={modal.role}
          editing={modal.editing}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
