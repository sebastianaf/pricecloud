import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_NAME,
  absoluteUrl
} from '../../helper/site';

type SeoProps = {
  /** Sin el sufijo de marca: se le anade "| Pricecloud" salvo en la portada. */
  title?: string;
  description?: string;
  /** Ruta canonica. Si se omite se toma la del router (sin query). */
  path?: string;
  /** Formularios de acceso y areas privadas: fuera de los buscadores. */
  noindex?: boolean;
  image?: string;
  /** Datos estructurados (JSON-LD). Se serializan tal cual dentro del head. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Metadatos de una pagina, en un solo sitio.
 *
 * Este proyecto usa el Pages Router, asi que no existen ni `export const
 * metadata` ni `app/manifest.ts` como en las apps hermanas (App Router): aqui
 * todo va por `next/head`. Los `<title>` sueltos que ya tenian las paginas se
 * sustituyen por este componente para que ademas emitan description, canonical,
 * Open Graph y Twitter, que es lo que faltaba por completo.
 */
function Seo({
  title,
  description = SITE_DESCRIPTION,
  path,
  noindex = false,
  image = SITE_IMAGE,
  jsonLd
}: SeoProps) {
  const router = useRouter();
  // asPath trae query y hash; el canonical tiene que ir limpio o cada
  // variante con ?utm_... se indexaria como una pagina distinta.
  const canonicalPath = path ?? router.asPath.split('?')[0].split('#')[0];
  const canonical = absoluteUrl(canonicalPath);
  const fullTitle = title ? `${SITE_NAME} | ${title}` : SITE_NAME;
  const imageUrl = absoluteUrl(image);
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="es_ES" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {blocks.map((block, i) => (
        <script
          // Los datos estructurados son lo que leen tanto los resultados
          // enriquecidos de Google como los motores generativos.
          key={`jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </Head>
  );
}

export default Seo;
