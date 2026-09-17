// El tipo no se reexporta desde 'next' en esta version: vive en 'next/types'.
import type { GetServerSideProps } from 'next/types';

import {
  NOINDEX_ROUTES,
  PRIVATE_PREFIXES,
  absoluteUrl
} from '../src/helper/site';

/**
 * robots.txt generado, no estatico.
 *
 * Se sirve desde aqui y no desde `public/robots.txt` para que las rutas
 * privadas y el dominio salgan de `src/helper/site.ts`, que es la misma fuente
 * que usan el sitemap y el componente <Seo>. Con el fichero estatico habia que
 * acordarse de tocar dos sitios cada vez que se anadiera una seccion, y la
 * lista terminaria desincronizada.
 *
 * Ojo: si alguien vuelve a crear `public/robots.txt`, ese fichero estatico
 * gana sobre esta ruta y este codigo deja de ejecutarse en silencio.
 */
const Robots = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const disallow = [...NOINDEX_ROUTES, ...PRIVATE_PREFIXES]
    .map((route) => `Disallow: ${route}`)
    .join('\n');

  const body = `# https://www.robotstxt.org/robotstxt.html

User-agent: *
Allow: /$

# Formularios de acceso y areas privadas: no aportan nada en un buscador.
${disallow}

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(body);
  res.end();

  return { props: {} };
};

export default Robots;
