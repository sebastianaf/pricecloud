/**
 * Datos canonicos del sitio, en un solo lugar para que el SEO, el sitemap y
 * los datos estructurados no se contradigan entre si.
 *
 * NEXT_PUBLIC_SITE_URL es OPCIONAL a proposito: si falta se usa el dominio de
 * produccion. Asi no hay que tocar la credencial de Jenkins ni check-env.sh
 * para desplegar esto. Como toda NEXT_PUBLIC_*, se congela en el bundle
 * durante `next build`, o sea que cambiarla obliga a reconstruir la imagen.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://pricecloud.org'
).replace(/\/$/, '');

export const SITE_NAME = 'Pricecloud';

export const SITE_DESCRIPTION =
  'Compara los precios de AWS, Azure y Google Cloud sobre un catalogo comun, ' +
  'encuentra la region y el tipo de servicio que mejor encajan con tu ' +
  'proyecto, y despliega la infraestructura sin cambiar de herramienta.';

/** Imagen para las tarjetas de Open Graph y Twitter. */
export const SITE_IMAGE = '/icon-512x512.png';

export const absoluteUrl = (path = '/'): string =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Rutas publicas indexables. Es la unica fuente de verdad: la usan el sitemap
 * y el robots.txt generado. Todo lo demas de la app vive tras autenticacion y
 * no debe aparecer en buscadores.
 */
export const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 }
] as const;

/**
 * Rutas que existen publicamente pero no aportan nada en un buscador: son
 * formularios de acceso. Se sirven con noindex y se excluyen del sitemap.
 */
export const NOINDEX_ROUTES = [
  '/login',
  '/signup',
  '/recovery',
  '/password-reset',
  '/verify'
];

/** Areas privadas: nunca deben rastrearse. */
export const PRIVATE_PREFIXES = [
  '/dashboard',
  '/management',
  '/profile',
  '/providers',
  '/deploy'
];
