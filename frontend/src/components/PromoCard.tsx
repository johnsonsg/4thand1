import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { ComponentRendering, Field } from '@/lib/types/cms';

type PromoCardFields = {
  headline?: Field<string>;
  body?: Field<string>;
  ctaText?: Field<string>;
  ctaHref?: Field<string>;
};

type PromoCardProps = {
  rendering: ComponentRendering;
};

export default function PromoCard({ rendering }: PromoCardProps) {
  const fields = (rendering.fields ?? {}) as unknown as PromoCardFields;

  const headline = fields.headline?.value ?? 'PromoCard';
  const body =
    fields.body?.value ??
    'This is a second component rendered from layout JSON. In a real CMS setup, authors could add/remove this component on the page.';

  const ctaText = fields.ctaText?.value ?? 'Learn more';
  const ctaHref = fields.ctaHref?.value ?? '/tickets';

  return (
    <Card variant="outlined" className="mt-6 rounded-xl border-gray-200">
      <CardContent className="p-6">
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }} className="text-gray-900 dark:text-gray-100">
          {headline}
        </Typography>
        <Typography variant="body1" className="mt-2 text-gray-700 dark:text-gray-200">
          {body}
        </Typography>

        <div className="mt-4">
          <Button component={Link} href={ctaHref} variant="contained" disableElevation>
            {ctaText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
