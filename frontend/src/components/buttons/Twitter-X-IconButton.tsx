"use client";

import IconButton from "@mui/material/IconButton";
import { FaXTwitter } from "react-icons/fa6";

type TwitterXIconButtonProps = {
  href: string;
  label?: string;
};

export function TwitterXIconButton({ href, label = "Share on Twitter/X" }: TwitterXIconButtonProps) {
  return (
    <IconButton
      component="a"
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
      <FaXTwitter size={22} />
    </IconButton>
  );
}
