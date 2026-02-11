"use client";

// Admin-only field used by Payload Theme Settings.
import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useField, TextInput } from "@payloadcms/ui";
import { HexColorPicker } from "react-colorful";
import Button from "@mui/material/Button";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

type Props = {
  path: string;
  label?: string;
};

export const ColorPickerField: React.FC<Props> = ({ path, label }) => {
  const { value, setValue } = useField<string>({ path });
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value ?? "");
  const color = useMemo(() => (isHex ? (value as string) : "#000000"), [isHex, value]);

  const handlePickerChange = useCallback(
    (next: string) => {
      if (next !== value) setValue(next);
    },
    [setValue, value]
  );

  return (
    <div style={{ marginBottom: 16 }}>
      {label ? <label style={{ display: "block", marginBottom: 6 }}>{label}</label> : null}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <TextInput
          path={path}
          value={value ?? ""}
          onChange={(e:any) => setValue(e.target.value)}
          placeholder="#aabbcc"
        />
        <span
          aria-label="Color preview"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: color,
            display: "inline-block"
          }}
        />
      </div>

      <div ref={pickerRef} style={{ marginTop: 8 }}>
        <Button
          aria-label={isOpen ? "Close color picker" : "Open color picker"}
          onClick={() => setIsOpen((v) => !v)}
          size="small"
          variant="contained"
          startIcon={<WaterDropIcon fontSize="small" />}
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 1,
            "&:hover": { backgroundColor: "primary.dark" }
          }}
        >
          {isOpen ? "Hide picker" : "Pick color"}
        </Button>

        {isOpen ? (
          <div style={{ marginTop: 10 }}>
            <HexColorPicker color={color} onChange={handlePickerChange} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ColorPickerField;