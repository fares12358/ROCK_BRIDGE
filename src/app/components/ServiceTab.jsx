// components/ServiceTab.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaImage, FaTimes } from "react-icons/fa";
import { useAppContext } from "../context/contextApi";
import { getFullUrl } from "../lib/getFullUrl";

const API_SERVICES = "http://localhost:5000/api/services";

const axiosWithAuth = (onUploadProgress) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  return axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    timeout: 20000,
    onUploadProgress,
  });
};

function readableBytes(bytes = 0) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export default function ServiceTab() {
  const { isLogin } = useAppContext();

  // form state: english + arabic
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [adding, setAdding] = useState(false);

  // list state
  const [services, setServices] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // delete modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const cancelRef = useRef(null);

  // lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  // fetch services when logged in
  useEffect(() => {
    if (!isLogin) {
      setServices([]);
      return;
    }
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  // preview file
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // focus cancel when confirm opens
  useEffect(() => {
    if (confirmOpen && cancelRef.current) cancelRef.current.focus();
  }, [confirmOpen]);

  // close modals on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (lightboxOpen) {
          setLightboxOpen(false);
          setLightboxItem(null);
        } else if (confirmOpen) {
          setConfirmOpen(false);
          setServiceToDelete(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, confirmOpen]);

  const fetchServices = async () => {
    setLoadingList(true);
    try {
      const a = axiosWithAuth();
      const resp = await a.get(API_SERVICES);
      if (Array.isArray(resp?.data)) setServices(resp.data);
      else if (resp?.data?.services) setServices(resp.data.services);
      else setServices(resp?.data ? [resp.data] : []);
    } catch (err) {
      console.error("fetchServices", err);
      toast.error(err?.response?.data?.message || "Could not load services");
    } finally {
      setLoadingList(false);
    }
  };

  const onDrop = (ev) => {
    ev.preventDefault();
    const f = ev.dataTransfer?.files?.[0] ?? null;
    if (f && f.type.startsWith("image/")) setFile(f);
    else if (f) toast.error("Please upload an image file");
  };

  const onDragOver = (ev) => ev.preventDefault();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    if (f && f.type.startsWith("image/")) setFile(f);
    else if (f) toast.error("Please choose an image file");
  };

  const handleAdd = async (ev) => {
    ev?.preventDefault();
    if (!titleEn.trim()) return toast.error("English title required");
    if (!titleAr.trim()) return toast.error("Arabic title required");
    if (!descriptionEn.trim()) return toast.error("English description required");
    if (!descriptionAr.trim()) return toast.error("Arabic description required");
    if (!file) return toast.error("Please attach an image");

    setAdding(true);
    setUploadProgress(0);

    try {
      const form = new FormData();
      form.append("title_en", titleEn.trim());
      form.append("title_ar", titleAr.trim());
      form.append("description_en", descriptionEn.trim());
      form.append("description_ar", descriptionAr.trim());
      form.append("image", file);

      const a = axiosWithAuth((pe) => {
        if (pe.total) {
          const p = Math.round((pe.loaded / pe.total) * 100);
          setUploadProgress(p);
        }
      });

      const resp = await a.post(API_SERVICES, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = resp?.data?.service || resp?.data;
      toast.success(resp?.data?.message || "Service added");
      if (created) setServices((s) => [created, ...s]);
      else await fetchServices();

      // reset
      setTitleEn("");
      setTitleAr("");
      setDescriptionEn("");
      setDescriptionAr("");
      setFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (err) {
      console.error("add service", err);
      toast.error(err?.response?.data?.message || "Failed to add service");
      setUploadProgress(0);
    } finally {
      setAdding(false);
    }
  };

  const openConfirm = (service) => {
    setServiceToDelete(service);
    setConfirmOpen(true);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setServiceToDelete(null);
  };

  const doDelete = async () => {
    if (!serviceToDelete) return;
    const id = serviceToDelete._id || serviceToDelete.id;
    setDeletingId(id);
    try {
      const a = axiosWithAuth();
      await a.delete(`${API_SERVICES}/${id}`);
      setServices((s) => s.filter((x) => (x._id || x.id) !== id));
      toast.success("Service deleted");
      setConfirmOpen(false);
      setServiceToDelete(null);
    } catch (err) {
      console.error("delete service", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const openLightbox = (item) => {
    setLightboxItem(item);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Add service area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="md:flex md:items-start md:gap-6">
          {/* Left: form */}
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaImage /> Add service (EN + AR)
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Title (English)</label>
                  <input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Service title (English)"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">العنوان (بالعربية)</label>
                  <input
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="عنوان الخدمة (بالعربية)"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Description (English)</label>
                  <textarea
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Short description (English)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">الوصف (بالعربية)</label>
                  <textarea
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="وصف مختصر (بالعربية)"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">Image</label>

                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  className="border-2 border-dashed border-gray-200 rounded-md p-4 flex items-center gap-4 flex-col sm:flex-row sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-md bg-gray-50 border">
                      <FaImage />
                    </div>
                    <div>
                      <div className="text-sm text-gray-700">Drag & drop an image here, or</div>
                      <label className="inline-flex items-center gap-2 text-sm text-orange-600 hover:underline cursor-pointer">
                        <input onChange={handleFileChange} type="file" accept="image/*" className="hidden" />
                        <span className="inline-flex items-center gap-2"><FaPlus /> Choose image</span>
                      </label>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">Recommended: jpg/png. Max size: {process.env.NEXT_PUBLIC_FILE_LIMIT_MB || 20}MB</div>
                </div>

                {file && (
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-16 rounded-md overflow-hidden bg-gray-100 border">
                        <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">{readableBytes(file.size)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={adding}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 disabled:opacity-60"
                >
                  <FaPlus /> {adding ? "Adding..." : "Add service"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTitleEn("");
                    setTitleAr("");
                    setDescriptionEn("");
                    setDescriptionAr("");
                    setFile(null);
                    setPreviewUrl(null);
                    setUploadProgress(0);
                  }}
                  className="px-3 py-2 border rounded-md"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Right: live preview on wider screens */}
          <div className="hidden md:block md:w-72">
            <div className="text-sm text-gray-500 mb-2">Live preview</div>
            <div className="rounded-md overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-sm text-gray-400">No image selected</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services list */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Services</h3>
          <div className="text-sm text-gray-500">{services.length}</div>
        </div>

        {loadingList ? (
          <div className="text-center text-gray-500 py-8">Loading…</div>
        ) : services.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => {
              const id = s._id || s.id;
              const imgUrl = getFullUrl(s.img || s.image || s.imgUrl || "");
              return (
                <div
                  key={id}
                  className="bg-white  rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="relative w-full h-44 bg-gray-100 cursor-pointer"
                    onClick={() => openLightbox(s)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openLightbox(s)}
                  >
                    {imgUrl ? (
                      <img src={imgUrl} alt={s.title_en || s.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="p-3 text-xs text-gray-500">no image</div>
                    )}
                  </div>

                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex-1 pr-2">
                      <div className="font-medium">{s.title_en}</div>
                      <div className="text-sm text-gray-600 mt-1">{String(s.description_en || "").slice(0, 120)}</div>

                      {/* Arabic block */}
                      {s.title_ar && (
                        <div className="mt-2 text-right" dir="rtl">
                          <div className="font-medium text-sm">{s.title_ar}</div>
                          <div className="text-sm text-gray-600 mt-1">{String(s.description_ar || "").slice(0, 120)}</div>
                        </div>
                      )}

                      <div className="mt-2 text-xs text-gray-400">{s.createdAt ? new Date(s.createdAt).toLocaleString() : ""}</div>
                    </div>

                    <div className="flex items-start">
                      <button
                        onClick={() => openConfirm(s)}
                        disabled={deletingId === id}
                        className="text-red-600 hover:text-red-700"
                        aria-label={`Delete ${s.title_en}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-500 py-8 text-center">No services yet</div>
        )}
      </div>

      {/* Confirm modal */}
      {confirmOpen && serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Confirm delete</h3>
              <p className="text-sm text-gray-600 mb-4">
                Delete <strong>{serviceToDelete.title_en}</strong>? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button ref={cancelRef} onClick={cancelDelete} className="px-4 py-2 rounded-md border">
                  Cancel
                </button>

                <button
                  onClick={doDelete}
                  disabled={deletingId === (serviceToDelete._id || serviceToDelete.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {deletingId === (serviceToDelete._id || serviceToDelete.id) ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : null}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && lightboxItem && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setLightboxOpen(false);
            setLightboxItem(null);
          }}
        >
          <div className="max-w-4xl w-full max-h-full overflow-hidden rounded-md" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-black">
              <button
                onClick={() => {
                  setLightboxOpen(false);
                  setLightboxItem(null);
                }}
                className="absolute top-3 right-3 z-10 bg-black/40 text-white p-2 rounded-full"
                aria-label="Close"
              >
                <FaTimes />
              </button>

              {(() => {
                const url = getFullUrl(lightboxItem.img || lightboxItem.image || lightboxItem.imgUrl || "");
                if (!url) return <div className="p-8 text-white">No preview available</div>;
                return <img src={url} alt={lightboxItem.title_en || lightboxItem.title} className="w-full max-h-[80vh] object-contain" />;
              })()}

              <div className="p-4 bg-black/80 text-white">
                <div className="font-semibold">{lightboxItem.title_en}</div>
                <div className="text-sm text-gray-200 mt-1">{lightboxItem.description_en}</div>

                {lightboxItem.title_ar && (
                  <div className="mt-3 text-right" dir="rtl">
                    <div className="font-medium">{lightboxItem.title_ar}</div>
                    <div className="text-sm text-gray-200 mt-1">{lightboxItem.description_ar}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
