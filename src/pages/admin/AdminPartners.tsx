import { useRef, useState } from "react";
import { HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
    useCreatePartnerMutation,
    useDeletePartnerMutation,
    useGetPartnersQuery,
    useUpdatePartnerMutation,
    type Partner,
} from "../../app/api/partners";
import { Button } from "../../components";

interface FormState {
  name: string;
  website: string;
  description: string;
  featured: boolean;
  order: number;
}

const emptyForm: FormState = {
  name: "",
  website: "",
  description: "",
  featured: false,
  order: 0,
};

export default function AdminPartners() {
  const { data, isLoading, isError } = useGetPartnersQuery();
  const [createPartner] = useCreatePartnerMutation();
  const [updatePartner] = useUpdatePartnerMutation();
  const [deletePartner] = useDeletePartnerMutation();

  const partners = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    setEditingPartner(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      website: partner.website ?? "",
      description: partner.description ?? "",
      featured: partner.featured,
      order: partner.order,
    });
    setImageFile(null);
    setImagePreview(partner.logo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this partner?")) return;
    try {
      await deletePartner(id).unwrap();
      toast.success("Partner deleted");
    } catch {
      toast.error("Failed to delete partner");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "order"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner && !imageFile) {
      toast.error("Please select a logo image");
      return;
    }

    const fd = new FormData();
    fd.append("name", formData.name);
    if (formData.website) fd.append("website", formData.website);
    if (formData.description) fd.append("description", formData.description);
    fd.append("featured", String(formData.featured));
    fd.append("order", String(formData.order));
    if (imageFile) fd.append("logo", imageFile);

    try {
      if (editingPartner) {
        await updatePartner({ id: editingPartner.id, body: fd }).unwrap();
        toast.success("Partner updated");
      } else {
        await createPartner(fd).unwrap();
        toast.success("Partner added");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to save partner");
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  if (isError)
    return <p className="p-6 text-center text-red-500">Failed to load partners.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">Partners</h1>
          <p className="mt-1 text-sm text-secondary-300">
            Manage partner logos shown on the homepage
          </p>
        </div>
        <Button
          onClick={handleAdd}
          variant="secondary"
          className="flex items-center gap-2 rounded"
        >
          <HiPlus className="h-5 w-5" /> Add Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Total</p>
          <p className="mt-2 text-3xl font-semibold text-secondary-100">
            {partners.length}
          </p>
        </div>
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Featured</p>
          <p className="mt-2 text-3xl font-semibold text-primary-700">
            {partners.filter((p) => p.featured).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-secondary-300/30 bg-primary-800/5">
              <tr>
                {["Logo", "Name", "Website", "Order", "Featured", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-secondary-100"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/30">
              {partners.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-secondary-300"
                  >
                    No partners yet. Add your first partner.
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="transition hover:bg-primary-800/5"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-12 w-24 rounded object-contain"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-secondary-100">
                      {partner.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-700">
                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {partner.website}
                        </a>
                      ) : (
                        <span className="text-secondary-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-100">
                      {partner.order}
                    </td>
                    <td className="px-6 py-4">
                      {partner.featured ? (
                        <span className="inline-flex rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-secondary-200">
                          Yes
                        </span>
                      ) : (
                        <span className="text-sm text-secondary-300">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(partner)}
                          className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600"
                        >
                          <HiPencil className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(partner.id)}
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
                    {editingPartner ? "Edit Partner" : "Add New Partner"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-secondary-300 transition hover:text-secondary-100"
                  >
                    <HiXMark className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      Partner Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      placeholder="e.g., Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                      className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      placeholder="Brief description (optional)"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-secondary-100">
                        Display Order
                      </label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        min={0}
                        className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      />
                      <p className="mt-1 text-xs text-secondary-300">
                        Lower = appears first
                      </p>
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-secondary-300/30 text-primary-700"
                        />
                        <span className="text-sm font-semibold text-secondary-100">
                          Featured
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      Logo {!editingPartner && "*"}
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
                      className="rounded border border-secondary-300/30 px-4 py-2 text-sm text-secondary-100 hover:bg-primary-700/10"
                    >
                      {imageFile ? imageFile.name : "Choose logo..."}
                    </button>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-3 h-16 w-40 rounded object-contain border border-secondary-300/20 p-2"
                      />
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      className="flex-1 rounded"
                    >
                      {editingPartner ? "Update Partner" : "Add Partner"}
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
