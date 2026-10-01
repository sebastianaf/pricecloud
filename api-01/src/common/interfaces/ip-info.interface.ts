import { UserAgentInterface } from './user-agent.interface';

export interface IpInfoInterface {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  readme: string;
}

export interface IpInfo2Interface {
  /**
   * `null` cuando la consulta a ipinfo.io falla: sin red, con un 429 por
   * limite de cuota, o con una IP privada que ni se consulta.
   *
   * El tipo lo declaraba como no nulable aunque `getIpInfo` ya devolvia null
   * en su `catch`. Por eso nadie lo protegio y un 429 del proveedor tumbaba
   * el login entero con `Cannot destructure property 'country' of
   * 'ipInfo.ipInfo' as it is null`.
   */
  ipInfo: IpInfoInterface | null;
  userAgent: UserAgentInterface;
}
