// components/QuotesTab.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaEnvelopeOpenText } from "react-icons/fa";
import { useAppContext } from "../context/contextApi";

const API_QUOTES = "http://localhost:5000/api/quotes";

const axiosWithAuth = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  return axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    timeout: 20000,
  });
};

export default function QuotesTab() {
  const { isLogin } = useAppContext();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!isLogin) {
      setQuotes([]);
      return;
    }
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  useEffect(() => {
    if (confirmOpen && cancelRef.current) cancelRef.current.focus();
  }, [confirmOpen]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const a = axiosWithAuth();
      const resp = await a.get(API_QUOTES);
      setQuotes(Array.isArray(resp?.data) ? resp.data : []);
    } catch (err) {
      console.error("fetchQuotes", err);
      toast.error(err?.response?.data?.message || "Could not load quotes");
    } finally {
      setLoading(false);
    }
  };

  const openConfirm = (q) => {
    setQuoteToDelete(q);
    setConfirmOpen(true);
  };

  const cancelDelete = () => {
    setQuoteToDelete(null);
    setConfirmOpen(false);
  };

  const doDelete = async () => {
    if (!quoteToDelete) return;
    const id = quoteToDelete._id || quoteToDelete.id;
    setDeletingId(id);
    try {
      const a = axiosWithAuth();
      await a.delete(`${API_QUOTES}/${id}`);
      setQuotes((s) => s.filter((x) => (x._id || x.id) !== id));
      toast.success("Quote deleted");
      setConfirmOpen(false);
      setQuoteToDelete(null);
    } catch (err) {
      console.error("deleteQuote", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Quote Requests</h3>
          <div className="text-sm text-gray-500">{quotes.length}</div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading…</div>
        ) : quotes.length ? (
          <div className="space-y-3">
            {quotes.map((q) => {
              const id = q._id || q.id;
              return (
                <div key={id} className="shadow-md border border-gray-50 rounded-md p-3 flex items-start gap-3 bg-white">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{q.name}</div>
                        <div className="text-sm text-gray-600">{q.email} & {q.phone}</div>
                      </div>

                      <div className="text-xs text-gray-400">{q.createdAt ? new Date(q.createdAt).toLocaleString() : ""}</div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{q.message}</div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => openConfirm(q)}
                      disabled={deletingId === id}
                      className="text-red-600 hover:text-red-700"
                      aria-label={`Delete quote from ${q.name}`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-500 py-8 text-center">No quote requests yet</div>
        )}
      </div>

      {/* Confirmation modal */}
      {confirmOpen && quoteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Confirm delete</h3>
              <p className="text-sm text-gray-600 mb-4">
                Delete the quote request from <strong>{quoteToDelete.name}</strong>? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button ref={cancelRef} onClick={cancelDelete} className="px-4 py-2 rounded-md border">
                  Cancel
                </button>

                <button
                  onClick={doDelete}
                  disabled={deletingId === (quoteToDelete._id || quoteToDelete.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {deletingId === (quoteToDelete._id || quoteToDelete.id) ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
