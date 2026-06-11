import { useEffect, useRef, useState } from "react";
import { HiBold, HiItalic, HiListBullet, HiNumberedList, HiOutlinePhoto, HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
  useCreatePublicationMutation,
  useDeletePublicationMutation,
  useGetAllPublicationsQuery,
  useUpdatePublicationMutation,
  type Publication,
} from "../../app/api/publications";
import { Button } from "../../components";
import CategorySelect from "../../components/CategorySelect";

type PubType = "article" | "file";

interface FormState {
  title: string;
  category: string;
  published: boolean;
  featured: boolean;
  isPremium: boolean;
  price: string;
  momoNumber: string;
  pubType: PubType;
}

const emptyForm: FormState = {
  title: "",
  category: "General",
  published: false,
  featured: false,
  isPremium: false,
  price: "",
  momoNumber: "",
  pubType: "article",
};

const categories = ["General", "Reports", "Brochures", "Catalogs", "Newsletters", "Guides", "Other"];

// ── Rich text editor sub-component ─────────────────────────────────────────
function RichEditor({
  initialContent,
  editorRef,
}: {
  initialContent: string;
  editorRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Populate content whenever initialContent changes (i.e. when edit opens)
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent, editorRef]);

  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        editorRef.current?.focus();
        document.execCommand("insertImage", false, dataUrl);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div>
      <div className="mb-1 flex flex-wrap gap-1 rounded-t border border-b-0 border-secondary-300/30 bg-primary-800/5 p-2">
        {(["H2", "H3", "P"] as const).map((tag) => (
          <button key={tag} type="button" onClick={() => exec("formatBlock", tag.toLowerCase())} className="rounded px-3 py-1.5 text-xs font-semibold text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200">{tag}</button>
        ))}
        <div className="mx-1 w-px bg-secondary-300/30" />
        <button type="button" onClick={() => exec("bold")} className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200"><HiBold className="h-4 w-4" /></button>
        <button type="button" onClick={() => exec("italic")} className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200"><HiItalic className="h-4 w-4" /></button>
        <div className="mx-1 w-px bg-secondary-300/30" />
        <button type="button" onClick={() => exec("insertUnorderedList")} className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200"><HiListBullet className="h-4 w-4" /></button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200"><HiNumberedList className="h-4 w-4" /></button>
        <div className="mx-1 w-px bg-secondary-300/30" />
        <button type="button" onClick={insertImage} title="Insert image" className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200">
          <HiOutlinePhoto className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] max-h-[350px] overflow-y-auto rounded-b border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none [&_img]:max-w-full [&_img]:rounded [&_img]:my-2"
      />
    </div>
  );
}

export default function AdminPublications() {
  const { data, isLoading, isError } = useGetAllPublicationsQuery();
  const [createPublication, { isLoading: isSaving }] = useCreatePublicationMutation();
  const [updatePublication, { isLoading: isUpdating }] = useUpdatePublicationMutation();
  const [deletePublication, { isLoading: isDeleting }] = useDeletePublicationMutation();
  const isMutating = isSaving || isUpdating;

  const publications = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Publication | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [initialContent, setInitialContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setInitialContent("");
    setCoverFile(null);
    setCoverPreview("");
    setUploadFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pub: Publication) => {
    setEditingItem(pub);
    setFormData({
      title: pub.title,
      category: pub.category,
      published: pub.published,
      featured: pub.featured,
      isPremium: pub.isPremium ?? false,
      price: pub.price ?? "",
      momoNumber: pub.momoNumber ?? "",
      pubType: pub.fileContent ? "file" : "article",
    });
    setInitialContent(pub.content ?? "");
    setCoverFile(null);
    setCoverPreview(pub.coverImage ?? "");
    setUploadFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this publication?")) return;
    try {
      await deletePublication(id).unwrap();
      toast.success("Publication deleted");
    } catch {
      toast.error("Failed to delete publication");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const content = contentEditableRef.current?.innerHTML ?? "";
    if (formData.pubType === "article" && !content.trim()) {
      toast.error("Please add content for the article");
      return;
    }
    if (formData.pubType === "file" && !editingItem && !uploadFile) {
      toast.error("Please upload a file");
      return;
    }

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("category", formData.category);
    fd.append("published", String(formData.published));
    fd.append("featured", String(formData.featured));
    fd.append("isPremium", String(formData.isPremium));
    if (formData.price) fd.append("price", formData.price);
    if (formData.momoNumber) fd.append("momoNumber", formData.momoNumber);
    if (formData.pubType === "article") {
      fd.append("content", content);
    }
    if (coverFile) fd.append("coverImage", coverFile);
    if (uploadFile) fd.append("file", uploadFile);

    try {
      if (editingItem) {
        await updatePublication({ id: editingItem.id, body: fd }).unwrap();
        toast.success("Publication updated");
      } else {
        await createPublication(fd).unwrap();
        toast.success("Publication created");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to save publication");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load publications.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Publications</h1>
          <p className="mt-1 text-sm text-secondary-300">Manage articles, reports, brochures and uploaded files</p>
        </div>
        <Button onClick={handleAdd} variant="secondary" className="flex items-center gap-2 rounded">
          <HiPlus className="h-5 w-5" /> Add Publication
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total", value: publications.length, color: "text-secondary-100" },
          { label: "Published", value: publications.filter((p) => p.published).length, color: "text-green-600" },
          { label: "Drafts", value: publications.filter((p) => !p.published).length, color: "text-yellow-600" },
          { label: "Featured", value: publications.filter((p) => p.featured).length, color: "text-primary-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
            <p className="text-sm text-secondary-300">{s.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-secondary-300/30 bg-primary-800/5">
              <tr>
                {["Cover", "Title", "Category", "Type", "Status", "Featured", "Views", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/30">
              {publications.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-secondary-300">No publications yet.</td></tr>
              ) : (
                publications.map((pub) => (
                  <tr key={pub.id} className="transition hover:bg-primary-800/5">
                    <td className="px-6 py-4">
                      {pub.coverImage ? (
                        <img src={pub.coverImage} alt={pub.title} className="h-12 w-16 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-16 rounded bg-primary-800/10 flex items-center justify-center text-xs text-secondary-300">No cover</div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs font-semibold text-secondary-100 line-clamp-2">{pub.title}</td>
                    <td className="px-6 py-4 text-xs tracking-[0.12em] uppercase text-primary-700">{pub.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${pub.fileContent ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                        {pub.fileContent ? "File" : "Article"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${pub.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {pub.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {pub.featured ? <span className="inline-flex rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-secondary-200">Yes</span> : <span className="text-sm text-secondary-300">No</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{pub.views}</td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{formatDate(pub.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(pub)} className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600">
                          <HiPencil className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => handleDelete(pub.id)} disabled={isDeleting} className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
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
              <div className="relative my-8 w-full max-w-3xl rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
                  <h2 className="text-xl font-semibold text-secondary-100">{editingItem ? "Edit Publication" : "Add Publication"}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary-300 transition hover:text-secondary-100"><HiXMark className="h-6 w-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                  {/* Title */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="Publication title" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Category */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Category *</label>
                      <CategorySelect
                        value={formData.category}
                        onChange={(val) => setFormData((p) => ({ ...p, category: val }))}
                        presetOptions={categories}
                        existingCategories={publications.map((p) => p.category)}
                        required
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Publication Type *</label>
                      <select name="pubType" value={formData.pubType} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none">
                        <option value="article">Article (rich text)</option>
                        <option value="file">File upload (PDF, DOCX)</option>
                      </select>
                    </div>
                  </div>

                  {/* Article content */}
                  {formData.pubType === "article" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Content *</label>
                      <RichEditor
                        initialContent={initialContent}
                        editorRef={contentEditableRef}
                      />
                    </div>
                  )}

                  {/* File upload */}
                  {formData.pubType === "file" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">File {!editingItem && "*"} <span className="font-normal text-secondary-300">(PDF, DOCX — max 20MB)</span></label>
                      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10">
                        {uploadFile ? uploadFile.name : editingItem?.fileName ? `Current: ${editingItem.fileName}` : "Choose file..."}
                      </button>
                    </div>
                  )}

                  {/* Cover image */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Cover Image <span className="font-normal text-secondary-300">(optional)</span></label>
                    <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} className="hidden" />
                    <button type="button" onClick={() => coverInputRef.current?.click()} className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10">
                      {coverFile ? coverFile.name : "Choose cover image..."}
                    </button>
                    {coverPreview && <img src={coverPreview} alt="Cover preview" className="mt-3 h-28 w-full rounded object-cover" />}
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
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="h-4 w-4 rounded border-secondary-300/30 text-primary-700" />
                      <span className="text-sm font-semibold text-secondary-100">Premium (Paid)</span>
                    </label>
                  </div>

                  {/* Premium fields */}
                  {formData.isPremium && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-secondary-100">Price *</label>
                        <input type="text" name="price" value={formData.price} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="e.g. 1000 RWF" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-secondary-100">MoMo Number *</label>
                        <input type="text" name="momoNumber" value={formData.momoNumber} onChange={handleChange} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="e.g. 0788313617" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="secondary" className="flex-1 rounded" disabled={isMutating}>{isMutating ? "Saving..." : editingItem ? "Update" : "Add Publication"}</Button>
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
