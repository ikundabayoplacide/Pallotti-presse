import { useState } from "react";
import { HiPencil, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
    useCreateFAQMutation,
    useDeleteFAQMutation,
    useGetAllFAQsQuery,
    useUpdateFAQMutation,
    type FAQ,
} from "../../app/api/faqs";
import { Button } from "../../components";

interface FormState {
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

const emptyForm: FormState = {
  question: "",
  answer: "",
  order: 0,
  published: true,
};

export default function AdminFAQs() {
  const { data, isLoading, isError } = useGetAllFAQsQuery();
  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const faqs = data?.data ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  const handleAdd = () => {
    setEditingFAQ(null);
    setFormData({ ...emptyForm, order: faqs.length });
    setIsModalOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      published: faq.published,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await deleteFAQ(id).unwrap();
      toast.success("FAQ deleted");
    } catch {
      toast.error("Failed to delete FAQ");
    }
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
    try {
      if (editingFAQ) {
        await updateFAQ({ id: editingFAQ.id, body: formData }).unwrap();
        toast.success("FAQ updated");
      } else {
        await createFAQ(formData).unwrap();
        toast.success("FAQ created");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to save FAQ");
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  if (isError)
    return <p className="p-6 text-center text-red-500">Failed to load FAQs.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-100">FAQs</h1>
          <p className="mt-1 text-sm text-secondary-300">
            Manage frequently asked questions shown on the Contact page
          </p>
        </div>
        <Button
          onClick={handleAdd}
          variant="secondary"
          className="flex items-center gap-2 rounded"
        >
          <HiPlus className="h-5 w-5" /> Add FAQ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Total</p>
          <p className="mt-2 text-3xl font-semibold text-secondary-100">{faqs.length}</p>
        </div>
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Published</p>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {faqs.filter((f) => f.published).length}
          </p>
        </div>
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6">
          <p className="text-sm text-secondary-300">Hidden</p>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">
            {faqs.filter((f) => !f.published).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-secondary-300/30 bg-primary-800/5">
              <tr>
                {["#", "Question", "Answer", "Status", "Actions"].map((h) => (
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
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondary-300">
                    No FAQs yet. Add your first one.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="transition hover:bg-primary-800/5">
                    <td className="px-6 py-4 text-sm text-secondary-300">{faq.order}</td>
                    <td className="px-6 py-4 max-w-xs font-semibold text-secondary-100">
                      {faq.question}
                    </td>
                    <td className="px-6 py-4 max-w-sm text-sm text-secondary-100 line-clamp-2">
                      {faq.answer}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          faq.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {faq.published ? "Published" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600"
                        >
                          <HiPencil className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
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
                    {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
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
                      Question *
                    </label>
                    <input
                      type="text"
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      placeholder="e.g., What is your turnaround time?"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-secondary-100">
                      Answer *
                    </label>
                    <textarea
                      name="answer"
                      value={formData.answer}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                      placeholder="Provide a clear and helpful answer..."
                    />
                  </div>

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
                    <p className="mt-1 text-xs text-secondary-300">Lower = appears first</p>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-secondary-300/30 text-primary-700"
                    />
                    <span className="text-sm font-semibold text-secondary-100">
                      Published (visible on Contact page)
                    </span>
                  </label>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="secondary" className="flex-1 rounded">
                      {editingFAQ ? "Update FAQ" : "Add FAQ"}
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
