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
  ipInfo: IpInfoInterface;
  userAgent: UserAgentInterface;
}
