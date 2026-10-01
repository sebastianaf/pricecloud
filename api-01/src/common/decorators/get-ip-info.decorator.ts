import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import axios from 'axios';
import { IpInfoInterface } from '../interfaces/ip-info.interface';
import { Request } from 'express';
import { UserAgentInterface } from '../interfaces/user-agent.interface';

const IPINFO_BASE_URL = `https://ipinfo.io/`;

// Sin timeout, axios espera indefinidamente: una consulta de geolocalizacion
// colgada dejaria el login colgado con ella. Es telemetria, no vale la espera.
const IPINFO_TIMEOUT_MS = 2000;

/**
 * Direcciones que no tiene sentido consultar: loopback, rangos privados y
 * enlaces locales. ipinfo.io no sabe nada de ellas y cada intento gasta cuota
 * del limite gratuito, que es lo que acaba devolviendo 429 en produccion.
 */
const isPrivateAddress = (ip: string): boolean =>
  !ip ||
  ip === '::1' ||
  ip === 'localhost' ||
  /^127\./.test(ip) ||
  /^10\./.test(ip) ||
  /^192\.168\./.test(ip) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
  /^169\.254\./.test(ip) ||
  /^f[cd][0-9a-f]{2}:/i.test(ip);

export const getIpAddress = async (request: Request): Promise<string | null> => {
  try {
    const forwardedFor = request.headers['x-forwarded-for'];

    // `x-forwarded-for` puede llegar repetida, y entonces Express la entrega
    // como array en vez de como string.
    const rawForwarded = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor;

    if (rawForwarded) {
      // El primer valor de la cadena es el cliente original; el resto son los
      // proxies intermedios. Se recorta porque van separados por ", ".
      const [first] = rawForwarded.split(',');
      return first?.trim() || null;
    }

    // Sin cabecera de proxy, la IP del socket.
    //
    // Antes esta rama hacia `let [ipAddress] = '127.0.0.1'`, que no asigna la
    // cadena sino su PRIMER CARACTER: el valor resultante era "1" y se
    // consultaba https://ipinfo.io/1 en cada peticion sin proxy.
    return request.socket?.remoteAddress || null;
  } catch (error) {
    Logger.error(error.message);
    return null;
  }
};

export const getIpInfo = async (
  request: Request,
): Promise<IpInfoInterface | null> => {
  try {
    const ipAddress = await getIpAddress(request);

    if (isPrivateAddress(ipAddress)) {
      return null;
    }

    // El token es opcional: sin el, ipinfo.io aplica el limite anonimo por IP
    // de origen y en produccion se agota, devolviendo 429 en cada login. Con
    // token la cuota es mucho mayor. Ver IPINFO_TOKEN en .env.example.
    const token = process.env.IPINFO_TOKEN;

    const { data } = await axios.get<IpInfoInterface>(
      `${IPINFO_BASE_URL}${ipAddress}`,
      {
        timeout: IPINFO_TIMEOUT_MS,
        params: token ? { token } : undefined,
      },
    );

    return data;
  } catch (error) {
    // Se registra como warn y no como error: que falle la geolocalizacion no
    // es un fallo de la aplicacion, el login continua sin ubicacion.
    Logger.warn(
      `No se pudo obtener la geolocalizacion de la IP: ${error.message}`,
      `IpInfo`,
    );
    return null;
  }
};

const filterUserAgent = (userAgent: UserAgentInterface): UserAgentInterface => {
  return {
    browser: userAgent.browser,
    version: userAgent.version,
    os: userAgent.os,
    platform: userAgent.platform,
    source: userAgent.source,
  };
};

export const IpInfo = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ipInfo = await getIpInfo(request);
    return {
      ipInfo,
      // express-useragent puede no haber poblado `useragent` si el middleware
      // no corrio para esta ruta; sin la guarda, filterUserAgent revienta.
      userAgent: request.useragent ? filterUserAgent(request.useragent) : null,
    };
  },
);
