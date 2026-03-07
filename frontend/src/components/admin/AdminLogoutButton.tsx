"use client";

import * as React from "react";
import { useAuth } from "@payloadcms/ui";

export default function AdminLogoutButton() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/cms-api/users/logout", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
      });
    } finally {
      setLoading(false);
      window.location.href = "/admin";
    }
  };

  return (
    <div className="nav-group">
      <button
        type="button"
        className="btn btn--style-secondary btn--size-small"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
