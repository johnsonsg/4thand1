import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { ComponentRendering, Field } from '@/lib/types/cms';

type HeroFields = {
  title?: Field<string>;
  text?: Field<string>;
};

type HeroProps = {
  rendering: ComponentRendering;
};

export default function Hero({ rendering }: HeroProps) {
  const fields = (rendering.fields ?? {}) as unknown as HeroFields;

  return (
    <Card variant="outlined" className="rounded-xl border-gray-200">
      <CardContent className="p-6">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 600 }}>
          {fields.title?.value ?? 'Untitled Hero'}
        </Typography>
        {fields.text?.value ? (
          <Typography variant="body1" className="mt-3 pt-4 text-gray-700 dark:text-gray-200">
            {fields.text.value}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
