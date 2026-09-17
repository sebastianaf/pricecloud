import {
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl
} from './site';

/**
 * Datos estructurados schema.org (JSON-LD).
 *
 * Es la parte que mas rinde para GEO: los motores generativos citan mejor lo
 * que pueden leer como hechos declarados que lo que tienen que deducir del
 * maquetado. Y de paso habilita los resultados enriquecidos de Google.
 *
 * Se declara solo lo que es verificable en la propia aplicacion; nada de
 * valoraciones ni cifras inventadas, que ademas violarian las guias de
 * contenido de Google y pueden costar la elegibilidad a resultados
 * enriquecidos.
 */

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl(SITE_IMAGE),
  sameAs: ['https://github.com/sebastianaf/pricecloud']
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'es',
  publisher: { '@id': `${SITE_URL}/#organization` }
});

/**
 * `WebApplication` y no `SoftwareApplication` a secas: la app corre en el
 * navegador, y esa subclase es la que entienden los buscadores para SaaS.
 */
export const webApplicationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/#app`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requiere JavaScript',
  inLanguage: 'es',
  publisher: { '@id': `${SITE_URL}/#organization` },
  featureList: [
    'Comparacion de precios entre AWS, Azure y Google Cloud',
    'Catalogo de servicios cloud por familia de producto y region',
    'Aprovisionamiento de instancias y almacenamiento en AWS'
  ]
});

/**
 * Preguntas y respuestas de la portada. Las respuestas cortas y afirmativas
 * son justo lo que los motores generativos pueden citar sin reinterpretar.
 */
export const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Que proveedores de nube compara Pricecloud?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pricecloud compara precios de Amazon Web Services (AWS), Microsoft Azure y Google Cloud sobre un catalogo comun, organizado por familia de producto y region.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Se puede desplegar infraestructura desde Pricecloud?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Si. Conectando tus propias credenciales se pueden crear instancias de computo y almacenamiento en AWS desde la propia aplicacion, sin cambiar de herramienta.'
      }
    },
    {
      '@type': 'Question',
      name: '¿De donde salen los precios?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'De una base de datos de precios propia que se actualiza desde las fuentes publicas de cada proveedor, basada en el proyecto de codigo abierto cloud-pricing-api de Infracost.'
      }
    }
  ]
});
