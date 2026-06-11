import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  presetOptions: string[];
  existingCategories?: string[];
  required?: boolean;
}

export default function CategorySelect({ value, onChange, presetOptions, existingCategories = [], required }: Props) {
  const [isCustom, setIsCustom] = useState(false);

  // Merge preset + existing, deduplicate, exclude "Add new..."
  const allOptions = Array.from(new Set([...presetOptions, ...existingCategories])).sort();

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoFocus
          placeholder="Type new category..."
          className="flex-1 rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => { setIsCustom(false); onChange(presetOptions[0]); }}
          className="rounded border border-secondary-300/30 px-3 py-2 text-sm text-secondary-300 hover:text-secondary-100"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => {
        if (e.target.value === "__new__") {
          setIsCustom(true);
          onChange("");
        } else {
          onChange(e.target.value);
        }
      }}
      required={required}
      className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
    >
      {allOptions.map((c) => <option key={c} value={c}>{c}</option>)}
      <option value="__new__">+ Add new category...</option>
    </select>
  );
}
