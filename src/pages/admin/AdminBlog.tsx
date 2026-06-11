import { useRef, useState } from "react";
import { HiBold, HiItalic, HiListBullet, HiNumberedList, HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
    useCreateBlogMutation,
    useDeleteBlogMutation,
    useGetBlogsQuery,
    useUpdateBlogMutation,
    type BlogPost,
} from "../../app/api/blog";
import { Button } from "../../components";
import CategorySelect from "../../components/CategorySelect";

const categories = ["Design Tips", "Packaging", "Marketing", "Printing Basics", "Sustainability"];

interface FormState {
  title: string;
  excerpt: string;
  category: string;
  published: boolean;
}

const emptyForm: FormState = {
  title: "",
  excerpt: "",
  category: "Design Tips",
  published: true,
};

export default function AdminBlog() {
  const { data, isLoading, isError } = useGetBlogsQuery();
  const [createBlog, { isLoading: isSaving }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const isMutating = isSaving || isUpdating;

  const blogs = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
    setTimeout(() => { if (contentEditableRef.current) contentEditableRef.current.innerHTML = ""; }, 0);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ title: post.title, excerpt: post.excerpt, category: post.category, published: post.published });
    setImageFile(null);
    setImagePreview(post.image);
    setIsModalOpen(true);
    setTimeout(() => { if (contentEditableRef.current) contentEditableRef.current.innerHTML = post.content; }, 0);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await deleteBlog(id).unwrap();
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
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

  const insertFormatting = (tag: string) => {
    const editor = contentEditableRef.current;
    if (!editor) return;
    editor.focus();
    switch (tag) {
      case "h2": document.execCommand("formatBlock", false, "h2"); break;
      case "h3": document.execCommand("formatBlock", false, "h3"); break;
      case "p": document.execCommand("formatBlock", false, "p"); break;
      case "strong": document.execCommand("bold", false); break;
      case "em": document.execCommand("italic", false); break;
      case "u": document.execCommand("underline", false); break;
      case "ul": document.execCommand("insertUnorderedList", false); break;
      case "ol": document.execCommand("insertOrderedList", false); break;
      case "a": {
        const url = prompt("Enter URL:");
        if (url) document.execCommand("createLink", false, url);
        break;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost && !imageFile) {
      toast.error("Please select an image");
      return;
    }

    const content = contentEditableRef.current?.innerHTML || "";
    if (!content.trim()) {
      toast.error("Please add content");
      return;
    }

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("excerpt", formData.excerpt);
    fd.append("content", content);
    fd.append("category", formData.category);
    fd.append("published", String(formData.published));
    if (imageFile) fd.append("image", imageFile);

    try {
      if (editingPost) {
        await updateBlog({ id: editingPost.id, body: fd }).unwrap();
        toast.success("Post updated");
      } else {
        await createBlog(fd).unwrap();
        toast.success("Post created");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save post");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const filtered = filterCategory === "All" ? blogs : blogs.filter((p) => p.category === filterCategory);

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load blog posts.</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Blog Posts</h1>
          <p className="mt-1 text-sm text-secondary-300">Manage your blog articles</p>
        </div>
        <Button onClick={handleAdd} variant="secondary" className="flex items-center gap-2 rounded">
          <HiPlus className="h-5 w-5" /> Add Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total", value: blogs.length, color: "text-secondary-100" },
          { label: "Published", value: blogs.filter((p) => p.published).length, color: "text-green-600" },
          { label: "Drafts", value: blogs.filter((p) => !p.published).length, color: "text-yellow-600" },
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
                {["Image", "Title", "Category", "Author", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/30">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-secondary-300">No posts found.</td></tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id} className="transition hover:bg-primary-800/5">
                    <td className="px-6 py-4">
                      <img src={post.image} alt={post.title} className="h-16 w-16 rounded object-cover" />
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs font-semibold text-secondary-100 line-clamp-2">{post.title}</p>
                    </td>
                    <td className="px-6 py-4 text-xs tracking-[0.12em] uppercase text-primary-700">{post.category}</td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{post.author?.name ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{formatDate(post.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(post)} className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600">
                          <HiPencil className="h-4 w-4" /> Edit
                        </button>
        <button onClick={() => handleDelete(post.id)} disabled={isDeleting} className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
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
                  <h2 className="text-xl font-semibold text-secondary-100">{editingPost ? "Edit Post" : "Add New Post"}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary-300 transition hover:text-secondary-100"><HiXMark className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Title *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="Post title" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">Category *</label>
                      <CategorySelect
                        value={formData.category}
                        onChange={(val) => setFormData((p) => ({ ...p, category: val }))}
                        presetOptions={categories}
                        existingCategories={blogs.map((b) => b.category)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Excerpt *</label>
                    <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={2} className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none" placeholder="Brief summary..." />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Content *</label>
                    {/* Toolbar */}
                    <div className="mb-2 flex flex-wrap gap-1 rounded-t border border-b-0 border-secondary-300/30 bg-primary-800/5 p-2">
                      {[
                        { label: "H2", action: "h2" }, { label: "H3", action: "h3" }, { label: "P", action: "p" },
                      ].map((b) => (
                        <button key={b.action} type="button" onClick={() => insertFormatting(b.action)} className="rounded px-3 py-1.5 text-xs font-semibold text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200">{b.label}</button>
                      ))}
                      <div className="mx-1 w-px bg-secondary-300/30" />
                      <button type="button" onClick={() => insertFormatting("strong")} className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200"><HiBold className="h-4 w-4" /></button>
                      <button type="button" onClick={() => insertFormatting("em")} className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200"><HiItalic className="h-4 w-4" /></button>
                      <div className="mx-1 w-px bg-secondary-300/30" />
                      <button type="button" onClick={() => insertFormatting("ul")} className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200"><HiListBullet className="h-4 w-4" /></button>
                      <button type="button" onClick={() => insertFormatting("ol")} className="rounded p-1.5 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200"><HiNumberedList className="h-4 w-4" /></button>
                      <div className="mx-1 w-px bg-secondary-300/30" />
                      <button type="button" onClick={() => insertFormatting("a")} className="rounded px-3 py-1.5 text-xs font-semibold text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200">Link</button>
                    </div>
                    <div
                      ref={contentEditableRef}
                      contentEditable
                      className="min-h-[250px] max-h-[400px] w-full overflow-y-auto rounded-b border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">Image {!editingPost && "*"}</label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10">
                      {imageFile ? imageFile.name : "Choose image..."}
                    </button>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 h-32 w-full rounded object-cover" />}
                  </div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="h-4 w-4 rounded border-secondary-300/30 text-primary-700" />
                    <span className="text-sm font-semibold text-secondary-100">Publish immediately</span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="secondary" className="flex-1 rounded" disabled={isMutating}>{isMutating ? "Saving..." : editingPost ? "Update Post" : "Add Post"}</Button>
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
