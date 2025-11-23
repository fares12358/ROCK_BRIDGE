"use client";

import React, { useEffect, useState } from "react";

export default function ServiceForm({ initial = null, onCancel, onSave }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [img, setImg] = useState(initial?.img ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setImg(initial?.img ?? null);
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
  }, [initial]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImg(reader.result);
    reader.readAsDataURL(f);
  }

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Service title required");
    setSaving(true);
    try {
      await onSave({ title: title.trim(), description: description.trim(), img });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-md px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-md px-3 py-2" rows={3} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {img && <div className="mt-2 w-36 h-24 overflow-hidden rounded-md"><img src={img} alt="preview" className="w-full h-full object-cover" /></div>}
      </div>

      <div className="flex items-center gap-2">
        <button className="bg-[#9d1e17] text-white px-4 py-2 rounded-md" type="submit">{saving ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onCancel} className="bg-white border px-3 py-2 rounded-md">Cancel</button>
      </div>
    </form>
  );
}
