"use client";

import MuiButton from "@mui/material/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MuiBackButton() {
  return (
    <MuiButton
      component={Link}
      href="/"
      variant="outlined"
      startIcon={<ArrowLeft className="h-4 w-4" />}
      sx={{
        mt: 6,
        borderColor: "divider",
        color: "text.secondary",
        "&:hover": {
          borderColor: "rgba(212,160,23,0.4)",
          color: "primary.main",
        },
      }}
    >
      Back to Home
    </MuiButton>
  );
}
