import { useRef, useState } from "react";
import { HiCheckCircle, HiPencil, HiPlus, HiStar, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
    useApproveTestimonialMutation,
    useCreateTestimonialMutation,
    useDeleteTestimonialMutation,
    useGetAllTestimonialsQuery,
    useUpdateTestimonialMutation,
    type Testimonial,
} from "../../app/api/testimonials";
import { Button } from "../../components";

interface FormState {
  clientName: string;
  clientPosition: string;
  clientCompany: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  approved: boolean;
}

const emptyForm: FormState = {
  clientName: "",
  clientPosition: "",
  clientCompany: "",
  testimonial: "",
  rating: 5,
  featured: false,
  approved: true,
};

export default function AdminTestimonials() {
  const { data, isLoading, isError } = useGetAllTestimonialsQuery();
  const [createTestimonial] = useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [approveTestimonial] = useApproveTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const testimonials = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Approved" | "Pending">("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName,
      clientPosition: item.clientPosition ?? "",
      clientCompany: item.clientCompany ?? "",
      testimonial: item.testimonial,
      rating: item.rating,
      featured: item.featured,
      approved: item.approved,
    });
    setImageFile(null);
    setImagePreview(item.clientImage ?? "");
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveTestimonial(id).unwrap();
      toast.success("Testimonial approved");
    } catch {
      toast.error("Failed to approve testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id).unwrap();
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "rating"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("clientName", formData.clientName);
    if (formData.clientPosition) fd.append("clientPosition", formData.clientPosition);
    if (formData.clientCompany) fd.append("clientCompany", formData.clientCompany);
    fd.append("testimonial", formData.testimonial);
    fd.append("rating", String(formData.rating));
    fd.append("featured", String(formData.featured));
    fd.append("approved", String(formData.approved));
    if (imageFile) fd.append("clientImage", imageFile);

    try {
      if (editingItem) {
        await updateTestimonial({ id: editingItem.id, body: fd }).unwrap();
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(fd).unwrap();
        toast.success("Testimonial added");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to save testimonial");
    }
  };

  const filtered =
    filterStatus === "All"
      ? testimonials
      : filterStatus === "Approved"
      ? testimonials.filter((t) => t.approved)
      : testimonials.filter((t) => !t.approved);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <HiStar
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-secondary-300/40"}`}
      />
    ));

  if (isLoading)
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  if (isError)
    return <p className="p-6 text-center text-red-500">Failed to load testimonials.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Testimonials</h1>
          <p className="mt-1 text-sm text-secondary-300">
            Manage client testimonials and reviews
          </p>
        </div>
        <Button
          onClick={handleAdd}
          variant="secondary"
          className="flex items-center gap-2 rounded"
        >
          <HiPlus className="h-5 w-5" /> Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total", value: testimonials.length, color: "text-secondary-100" },
          { label: "Approved", value: testimonials.filter((t) => t.approved).length, color: "text-green-600" },
          { label: "Pending", value: testimonials.filter((t) => !t.approved).length, color: "text-yellow-600" },
          { label: "Featured", value: testimonials.filter((t) => t.featured).length, color: "text-primary-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
            <p className="text-sm text-secondary-300">{s.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["All", "Approved", "Pending"] as const).map((status) => (
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

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-secondary-300/30 bg-primary-800/5">
              <tr>
                {["Client", "Testimonial", "Rating", "Status", "Featured", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-secondary-300">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="transition hover:bg-primary-800/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.clientImage ? (
                          <img
                            src={item.clientImage}
                            alt={item.clientName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-secondary-200">
                            {item.clientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-secondary-100">{item.clientName}</p>
                          {item.clientPosition && (
                            <p className="text-xs text-secondary-300">{item.clientPosition}</p>
                          )}
                          {item.clientCompany && (
                            <p className="text-xs text-secondary-300">{item.clientCompany}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs text-sm text-secondary-100 line-clamp-2">
                        "{item.testimonial}"
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">{renderStars(item.rating)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.approved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.featured ? (
                        <span className="inline-flex rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-secondary-200">
                          Yes
                        </span>
                      ) : (
                        <span className="text-sm text-secondary-300">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {!item.approved && (
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="inline-flex items-center gap-1 rounded border border-green-300 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                            title="Approve"
                          >
                            <HiCheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600"
                        >
                          <HiPencil className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
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

      {/* Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 sm:p-6 lg:p-8">
              <div
                className="relative my-8 w-full max-w-lg rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
                  <h2 className="text-xl font-semibold text-secondary-100">
                    {editingItem ? "Edit Testimonial" : "Add Testimonial"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-secondary-300 transition hover:text-secondary-100"
                  >
                    <HiXMark className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        required
                        className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">
                        Position
                      </label>
                      <input
                        type="text"
                        name="clientPosition"
                        value={formData.clientPosition}
                        onChange={handleChange}
                        className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                        placeholder="e.g., CEO"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      Company
                    </label>
                    <input
                      type="text"
                      name="clientCompany"
                      value={formData.clientCompany}
                      onChange={handleChange}
                      className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      placeholder="e.g., Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      Testimonial *
                    </label>
                    <textarea
                      name="testimonial"
                      value={formData.testimonial}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      placeholder="Client's testimonial..."
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">
                        Rating *
                      </label>
                      <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {"★".repeat(r)}{"☆".repeat(5 - r)} ({r}/5)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">
                        Client Photo
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full rounded border border-secondary-300/30 px-4 py-3 text-left text-sm text-secondary-100 hover:bg-primary-700/10"
                      >
                        {imageFile ? imageFile.name : "Choose photo..."}
                      </button>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-2 h-12 w-12 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="approved"
                        checked={formData.approved}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-secondary-300/30 text-primary-700"
                      />
                      <span className="text-sm font-semibold text-secondary-100">Approved</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-secondary-300/30 text-primary-700"
                      />
                      <span className="text-sm font-semibold text-secondary-100">Featured</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="secondary" className="flex-1 rounded">
                      {editingItem ? "Update" : "Add Testimonial"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded"
                    >
                      Cancel
                    </Button>
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
