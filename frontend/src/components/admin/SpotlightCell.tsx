"use client";

import * as React from "react";

type SpotlightCellProps = {
  cellData?: boolean | null;
  rowData?: {
    id?: string | number | null;
  };
};

export default function SpotlightCell({ cellData, rowData }: SpotlightCellProps) {
  const [checked, setChecked] = React.useState(Boolean(cellData));
  const [isSaving, setIsSaving] = React.useState(false);

  const id = rowData?.id;

  React.useEffect(() => {
    setChecked(Boolean(cellData));
  }, [cellData]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!id || isSaving) return;

    const next = !checked;
    setChecked(next);
    setIsSaving(true);

    try {
      const response = await fetch(`/cms-api/players/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ spotlight: next }),
      });

      if (!response.ok) {
        throw new Error("Failed to update spotlight status");
      }
    } catch (error) {
      setChecked(!next);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <input
        aria-label="Show in player spotlight"
        checked={checked}
        className="h-4 w-4 cursor-pointer"
        disabled={!id || isSaving}
        onChange={handleChange}
        onClick={(event) => event.stopPropagation()}
        type="checkbox"
      />
    </div>
  );
}
