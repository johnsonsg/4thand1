"use client";

import Link from "next/link";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import { FaInstagram } from "react-icons/fa6";

type InstagramIconButtonProps = {
  href: string;
  label?: string;
};

export function InstagramIconButton({ href, label = "Share on Instagram" }: InstagramIconButtonProps) {
  return (
    <IconButton
      component={Link}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "secondary.main",
        "&:hover": {
          bgcolor: "secondary.dark",
        },
        mr: 1.5,
      }}
    >
      <FaInstagram size={22} />
    </IconButton>
  );
}
