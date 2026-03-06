"use client";

import React, { useEffect, useMemo } from "react";
import { TextInput, useField, useFormFields } from "@payloadcms/ui";

type Props = {
  path: string;
  label?: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const TenantIdField: React.FC<Props> = ({ path, label }) => {
  const { value, setValue } = useField<string>({ path });
  const brandName = useFormFields(([fields]) => {
    const fieldState = (fields ?? {}) as Record<string, { value?: unknown }>;
    return (fieldState["brand.brandName"]?.value as string | undefined) ?? "";
  });

  const derived = useMemo(() => (brandName ? slugify(String(brandName)) : ""), [brandName]);

  useEffect(() => {
    if (!value && derived) {
      setValue(derived);
    }
  }, [derived, setValue, value]);

  return (
    <TextInput
      path={path}
      label={label ?? "Tenant ID"}
      value={value ?? ""}
      onChange={(e: any) => setValue(e.target.value)}
      readOnly
    />
  );
};

export default TenantIdField;
