"use client";

// Small client-side helpers shared by admin pages.

export function ConfirmButton({ children, message = "Tens a certeza? Esta ação não pode ser desfeita.", className = "danger-btn" }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
