import React from "react";

export function Card({ children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
