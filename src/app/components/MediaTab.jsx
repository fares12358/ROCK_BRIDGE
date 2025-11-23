// components/MediaTab.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaPlay, FaImage, FaFilm, FaTimes } from "react-icons/fa";
import { useAppContext } from "../context/contextApi";
import { getFullUrl } from "../lib/getFullUrl";

const API_MEDIA = "http://localhost:5000/api/media";

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

export default function MediaTab({ preferredLang = "en" }) {
  const { isLogin } = useAppContext();

  // bilingual form state
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null); // "image" | "video" | null
  const [uploadProgress, setUploadProgress] = useState(0);
  const [adding, setAdding] = useState(false);

  // list state
  const [media, setMedia] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // delete modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const cancelRef = useRef(null);

  // lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    if (!isLogin) {
      setMedia([]);
      return;
    }
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const t = file.type || "";
    if (t.startsWith("video/")) setPreviewType("video");
    else if (t.startsWith("image/")) setPreviewType("image");
    else setPreviewType(null);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (confirmOpen && cancelRef.current) cancelRef.current.focus();
  }, [confirmOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (lightboxOpen) {
          setLightboxOpen(false);
          setLightboxItem(null);
        } else if (confirmOpen) {
          setConfirmOpen(false);
          setItemToDelete(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, confirmOpen]);

  const fetchMedia = async () => {
    setLoadingList(true);
    try {
      const a = axiosWithAuth();
      const resp = await a.get(API_MEDIA);
      if (Array.isArray(resp?.data)) setMedia(resp.data);
      else if (resp?.data?.media) setMedia(resp.data.media);
      else setMedia(resp?.data ? [resp.data] : []);
    } catch (err) {
      console.error("fetchMedia", err);
      toast.error(err?.response?.data?.message || "Could not load media");
    } finally {
      setLoadingList(false);
    }
  };

  const onDrop = (ev) => {
    ev.preventDefault();
    const f = ev.dataTransfer?.files?.[0] ?? null;
    if (f) setFile(f);
  };
  const onDragOver = (ev) => ev.preventDefault();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    if (f) setFile(f);
  };

  const handleAdd = async (ev) => {
    ev?.preventDefault();
    // require at least one title (prefer EN) and one description (prefer EN); but allow both empty if other language present
    const titleProvided = titleEn.trim() || titleAr.trim();
    const descProvided = descEn.trim() || descAr.trim();
    if (!titleProvided) return toast.error("Please provide a title (English or Arabic)");
    if (!descProvided) return toast.error("Please provide a description (English or Arabic)");
    if (!file) return toast.error("Please attach a file (image or video)");

    setAdding(true);
    setUploadProgress(0);

    try {
      const form = new FormData();
      // bilingual fields
      form.append("title_en", titleEn.trim());
      form.append("title_ar", titleAr.trim());
      form.append("description_en", descEn.trim());
      form.append("description_ar", descAr.trim());

      // file
      form.append("file", file);

      const a = axiosWithAuth((progressEvent) => {
        if (progressEvent.total) {
          const p = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(p);
        }
      });

      const resp = await a.post(API_MEDIA, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = resp?.data?.media || resp?.data;
      toast.success(resp?.data?.message || "Media uploaded");
      if (created) setMedia((m) => [created, ...m]);
      else await fetchMedia();

      // reset
      setTitleEn("");
      setTitleAr("");
      setDescEn("");
      setDescAr("");
      setFile(null);
      setPreviewUrl(null);
      setPreviewType(null);
      setUploadProgress(0);
    } catch (err) {
      console.error("add media", err);
      toast.error(err?.response?.data?.message || "Failed to upload media");
      setUploadProgress(0);
    } finally {
      setAdding(false);
    }
  };

  const openConfirm = (item) => {
    setItemToDelete(item);
    setConfirmOpen(true);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setItemToDelete(null);
  };

  const doDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete._id || itemToDelete.id;
    setDeletingId(id);
    try {
      const a = axiosWithAuth();
      await a.delete(`${API_MEDIA}/${id}`);
      setMedia((m) => m.filter((x) => (x._id || x.id) !== id));
      toast.success("Media deleted");
      setConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("delete media", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const openLightbox = (item) => {
    setLightboxItem(item);
    setLightboxOpen(true);
  };

  // helper to choose display title/desc based on preferredLang (falls back)
  const displayTitle = (item) => {
    if (!item) return "";
    return (preferredLang === "ar" ? (item.title_ar || item.title_en) : (item.title_en || item.title_ar)) || item.title || "";
  };
  const displayDesc = (item) => {
    if (!item) return "";
    return (preferredLang === "ar" ? (item.description_ar || item.description_en) : (item.description_en || item.description_ar)) || item.description || "";
  };

  return (
    <div className="space-y-6">
      {/* Add media */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="md:flex md:items-start md:gap-6">
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><FaImage /> Add media (EN + AR)</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Title (English)</span>
                  <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="mt-1 rounded-md border px-3 py-2" placeholder="Title (English)" />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Title (Arabic)</span>
                  <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="mt-1 rounded-md border px-3 py-2" placeholder="العنوان (بالعربية)" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Description (English)</span>
                  <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={3} className="mt-1 rounded-md border px-3 py-2" placeholder="Short description (English)" />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Description (Arabic)</span>
                  <textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} rows={3} className="mt-1 rounded-md border px-3 py-2" placeholder="وصف قصير (بالعربية)" />
                </label>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">File</label>
                <div onDrop={onDrop} onDragOver={onDragOver} className="border-2 border-dashed border-gray-200 rounded-md p-4 flex items-center gap-4 flex-col sm:flex-row sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-md bg-gray-50 border">{previewType === "video" ? <FaFilm /> : <FaImage />}</div>
                    <div>
                      <div className="text-sm text-gray-700">Drag & drop a file here, or</div>
                      <label className="inline-flex items-center gap-2 text-sm text-orange-600 hover:underline cursor-pointer">
                        <input onChange={handleFileChange} type="file" accept="image/*,video/*" className="hidden" />
                        <span className="inline-flex items-center gap-2"><FaPlus /> Choose file</span>
                      </label>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">Max: {process.env.NEXT_PUBLIC_MEDIA_LIMIT_MB || 100}MB. Supported: images & mp4/webm/quicktime/avi/mpeg.</div>
                </div>

                {file && (
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-14 rounded-md overflow-hidden bg-gray-100 border">
                        {previewType === "image" ? <img src={previewUrl} alt="preview" className="w-full h-full object-cover" /> : previewType === "video" ? <video src={previewUrl} controls className="w-full h-full object-cover" /> : <div className="p-2 text-xs">No preview</div>}
                      </div>
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">{file.type || "unknown"} · {readableBytes(file.size)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => { setFile(null); setPreviewUrl(null); setPreviewType(null); }} className="px-3 py-1 border rounded-md text-sm">Remove</button>
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
                <button type="submit" disabled={adding} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 disabled:opacity-60">
                  <FaPlus /> {adding ? "Uploading..." : "Upload"}
                </button>

                <button type="button" onClick={() => { setTitleEn(""); setTitleAr(""); setDescEn(""); setDescAr(""); setFile(null); setPreviewUrl(null); setPreviewType(null); setUploadProgress(0); }} className="px-3 py-2 border rounded-md">Clear</button>
              </div>
            </form>
          </div>

          {/* Right preview */}
          <div className="hidden md:block md:w-80">
            <div className="text-sm text-gray-500 mb-2">Live preview</div>
            <div className="rounded-md overflow-hidden bg-gray-50 h-56 flex items-center justify-center">
              {previewUrl ? (previewType === "video" ? <video src={previewUrl} controls className="w-full h-full object-cover" /> : <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />) : <div className="text-sm text-gray-400">No file selected</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Media list */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Media Library</h3>
          <div className="text-sm text-gray-500">{media.length}</div>
        </div>

        {loadingList ? <div className="text-center text-gray-500 py-8">Loading…</div> : media.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {media.map((item) => {
              const id = item._id || item.id;
              const url = getFullUrl(item.mediaUrl || item.url || "");
              const isVideo = (item.mediaType || "").toLowerCase() === "video" || (/^video\//i).test(item.mimeType || "");

              return (
                <div key={id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-full h-48 bg-gray-100 cursor-pointer" onClick={() => openLightbox(item)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openLightbox(item)}>
                    {url ? (isVideo ? <>
                      <video src={url} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/40 text-white rounded-full p-2"><FaPlay /></div>
                    </> : <img src={url} alt={displayTitle(item)} className="w-full h-full object-cover" />) : <div className="p-3 text-xs text-gray-500">no preview</div>}
                  </div>

                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex-1 pr-2">
                      <div className="font-medium">{item.title_en}</div>
                      <div className="text-sm text-gray-600 mt-1">{item.description_en}</div>
                      <div className="font-medium text-end">{item.title_ar}</div>
                      <div className="text-sm text-gray-600 mt-1 text-end">{item.description_ar}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => openConfirm(item)} disabled={deletingId === id} className="text-red-600 hover:text-red-700" aria-label={`Delete ${displayTitle(item)}`}><FaTrash /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <div className="text-sm text-gray-500 py-8 text-center">No media uploaded yet</div>}
      </div>

      {/* Confirm modal */}
      {confirmOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Confirm delete</h3>
              <p className="text-sm text-gray-600 mb-4">Delete <strong>{displayTitle(itemToDelete)}</strong>? This will remove the file and record. This cannot be undone.</p>

              <div className="flex items-center justify-end gap-3">
                <button ref={cancelRef} onClick={cancelDelete} className="px-4 py-2 rounded-md border">Cancel</button>
                <button onClick={doDelete} disabled={deletingId === (itemToDelete._id || itemToDelete.id)} className="px-4 py-2 bg-red-600 text-white rounded-md inline-flex items-center gap-2 disabled:opacity-60">
                  {deletingId === (itemToDelete._id || itemToDelete.id) ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> : null}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && lightboxItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" onClick={() => { setLightboxOpen(false); setLightboxItem(null); }}>
          <div className="max-w-5xl w-full max-h-full overflow-hidden rounded-md" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-black">
              <button onClick={() => { setLightboxOpen(false); setLightboxItem(null); }} className="absolute top-3 right-3 z-10 bg-black/40 text-white p-2 rounded-full" aria-label="Close"><FaTimes /></button>

              {(() => {
                const url = getFullUrl(lightboxItem.mediaUrl || lightboxItem.url || "");
                const isVideo = (lightboxItem.mediaType || "").toLowerCase() === "video" || (/^video\//i).test(lightboxItem.mimeType || "");
                if (!url) return <div className="p-8 text-white">No preview available</div>;
                return isVideo ? <video src={url} controls autoPlay className="w-full h-[70vh] object-contain bg-black" /> : <img src={url} alt={displayTitle(lightboxItem)} className="w-full max-h-[80vh] object-contain" />;
              })()}

              <div className="p-4 bg-black/80 text-white">
                <div className="font-semibold">{displayTitle(lightboxItem)}</div>
                <div className="text-sm text-gray-200 mt-1">{displayDesc(lightboxItem)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
