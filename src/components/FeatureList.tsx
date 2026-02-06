import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { ComponentRendering, Field } from '@/lib/types/cms';

type FeatureListFields = {
  title?: Field<string>;
  items?: Field<string[]>;
};

type Props = {
  rendering: ComponentRendering;
};

export default function FeatureList({ rendering }: Props) {
  const fields = (rendering.fields ?? {}) as unknown as FeatureListFields;

  const title = fields.title?.value ?? 'Feature List';
  const items = fields.items?.value ?? ['Fast', 'Composable', 'SSR-friendly'];

  return (
    <Card variant="outlined" className="mt-6 rounded-xl border-gray-200">
      <CardContent className="p-6">
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }} className="text-gray-900 dark:text-gray-100">
          {title}
        </Typography>

        <ul className="mt-3 list-disc pl-6 text-gray-700 dark:text-gray-200">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}