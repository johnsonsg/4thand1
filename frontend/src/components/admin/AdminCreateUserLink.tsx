"use client";

import Link from "next/link";

export default function AdminCreateUserLink() {
  return (
    <div className="nav-group">
      <Link href="/admin/collections/users/create" className="btn btn--style-secondary btn--size-small">
        Create user
      </Link>
    </div>
  );
}
