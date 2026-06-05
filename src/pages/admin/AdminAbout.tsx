import { useEffect, useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useGetAboutQuery, useUpdateAboutMutation, type AboutValue } from "../../app/api/about";
import { Button } from "../../components";

export default function AdminAbout() {
  const { data, isLoading, isError } = useGetAboutQuery();
  const [updateAbout, { isLoading: isSaving }] = useUpdateAboutMutation();

  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [values, setValues] = useState<AboutValue[]>([]);

  // Populate form when data loads
  useEffect(() => {
    if (data?.data) {
      const a = data.data;
      setHeroTitle(a.heroTitle);
      setHeroDescription(a.heroDescription);
      setAboutDescription(a.aboutDescription);
      setVision(a.vision);
      setMission(a.mission);
      setValues(a.values ?? []);
    }
  }, [data]);

  const handleValueChange = (index: number, field: keyof AboutValue, value: string) => {
    setValues((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const addValue = () => {
    setValues((prev) => [...prev, { title: "", description: "" }]);
  };

  const removeValue = (index: number) => {
    setValues((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAbout({ heroTitle, heroDescription, aboutDescription, vision, mission, values }).unwrap();
      toast.success("About content updated successfully");
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to update about content");
    }
  };

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load about content.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-100">About Page Content</h1>
        <p className="mt-1 text-sm text-secondary-300">Manage the content shown on the About page and the About Us section on the homepage</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Hero Section */}
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <h2 className="mb-4 text-lg font-semibold text-secondary-100 border-b border-secondary-300/20 pb-3">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary-100">Hero Title *</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                required
                className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                placeholder="Page headline"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary-100">Hero Description *</label>
              <textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                required
                rows={3}
                className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                placeholder="Subtitle shown under the hero title"
              />
            </div>
          </div>
        </div>

        {/* About Us Card */}
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <h2 className="mb-4 text-lg font-semibold text-secondary-100 border-b border-secondary-300/20 pb-3">About Us Card <span className="text-xs font-normal text-secondary-300">(shown on homepage)</span></h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary-100">Company Description *</label>
              <textarea
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                required
                rows={4}
                className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                placeholder="Short company description"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary-100">Our Vision *</label>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                required
                rows={2}
                className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                placeholder="Vision statement"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary-100">Our Mission *</label>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                required
                rows={2}
                className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                placeholder="Mission statement"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-secondary-300/20 pb-3 mb-4">
            <h2 className="text-lg font-semibold text-secondary-100">Why Clients Choose Us <span className="text-xs font-normal text-secondary-300">(values cards)</span></h2>
            <button
              type="button"
              onClick={addValue}
              className="inline-flex items-center gap-1 rounded bg-primary-700 px-3 py-2 text-xs font-semibold text-secondary-200 transition hover:bg-primary-600"
            >
              <HiPlus className="h-4 w-4" /> Add Value
            </button>
          </div>

          {values.length === 0 && (
            <p className="text-sm text-secondary-300">No values yet. Click "Add Value" to add one.</p>
          )}

          <div className="space-y-4">
            {values.map((value, index) => (
              <div key={index} className="rounded border border-secondary-300/20 bg-style-600/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary-300">Value {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <HiTrash className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => handleValueChange(index, "title", e.target.value)}
                    required
                    className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-2 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                    placeholder="Value title (e.g. Precision Printing)"
                  />
                  <textarea
                    value={value.description}
                    onChange={(e) => handleValueChange(index, "description", e.target.value)}
                    required
                    rows={2}
                    className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-2 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                    placeholder="Value description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" variant="secondary" className="rounded" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
