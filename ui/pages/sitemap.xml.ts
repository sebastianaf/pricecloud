// El tipo no se reexporta desde 'next' en esta version: vive en 'next/types'.
import type { GetServerSideProps } from 'next/types';

import { PUBLIC_ROUTES, absoluteUrl } from '../src/helper/site';

/**
 * Sitemap servido en /sitemap.xml.
 *
 * En el App Router existe `app/sitemap.ts`; en el Pages Router la forma
 * equivalente es una pagina que no renderiza nada y escribe el XML en
 * `getServerSideProps`. Se genera en cada peticion en vez de como fichero
 * estatico para que `lastmod` no quede congelado en el momento del build.
 */
const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = PUBLIC_ROUTES.map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${absoluteUrl(path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default Sitemap;
