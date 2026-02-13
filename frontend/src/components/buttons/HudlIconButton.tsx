"use client";

import Link from "next/link";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";

type HudlIconButtonProps = {
  href: string;
  label?: string;
};

export function HudlIconButton({ href, label = "View Hudl profile" }: HudlIconButtonProps) {
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
      }}
    >
      <Image src="/images/Hudl-Icon.svg" alt="Hudl" width={22} height={22} />
    </IconButton>
  );
}
