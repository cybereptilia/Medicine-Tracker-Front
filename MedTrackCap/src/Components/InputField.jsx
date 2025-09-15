// src/Components/InputField.jsx
import React from "react";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-black mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg text-black"
      />
    </div>
  );
}
