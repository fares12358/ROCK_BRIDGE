"use client";

import React from "react";

export default function ServiceCard({ item, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="w-full h-40 rounded-md overflow-hidden bg-gray-100 mb-3">
        {item.img ? (
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={onDelete} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
      </div>
    </div>
  );
}
