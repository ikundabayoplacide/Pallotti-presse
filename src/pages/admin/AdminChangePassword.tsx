import { useState } from "react";
import { HiEye, HiEyeSlash, HiLockClosed } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../app/api/auth";
import { Button } from "../../components";

export default function AdminChangePassword() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showFields, setShowFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleShow = (name: keyof typeof showFields) =>
    setShowFields((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to change password");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-100">Change Password</h1>
        <p className="mt-1 text-sm text-secondary-300">Update your admin account password</p>
      </div>

      <div className="max-w-md rounded-lg border border-secondary-300/30 bg-secondary-200 p-8 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {([
            { label: "Current Password", name: "currentPassword" as const },
            { label: "New Password", name: "newPassword" as const },
            { label: "Confirm New Password", name: "confirmPassword" as const },
          ]).map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-semibold text-secondary-100">
                {field.label} *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiLockClosed className="h-4 w-4 text-secondary-300" />
                </div>
                <input
                  type={showFields[field.name] ? "text" : "password"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-secondary-300/30 bg-secondary-200 py-3 pl-10 pr-10 text-sm text-secondary-100 placeholder:text-secondary-300 focus:border-primary-700 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => toggleShow(field.name)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary-300 hover:text-secondary-100"
                >
                  {showFields[field.name]
                    ? <HiEyeSlash className="h-4 w-4" />
                    : <HiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}

          <Button
            type="submit"
            variant="secondary"
            className="w-full rounded"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}