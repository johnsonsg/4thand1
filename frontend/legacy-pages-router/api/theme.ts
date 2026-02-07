import type { NextApiRequest, NextApiResponse } from 'next';
import { getThemeConfig, saveThemeConfig } from '@/lib/theme/themeStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const theme = await getThemeConfig();
    res.status(200).json(theme);
    return;
  }

  if (req.method === 'PUT') {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: 'Body must be a JSON object.' });
      return;
    }

    await saveThemeConfig(req.body);
    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader('Allow', 'GET, PUT');
  res.status(405).json({ error: 'Method not allowed' });
}
