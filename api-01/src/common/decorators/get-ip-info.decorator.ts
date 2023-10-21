import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import axios from 'axios';
import { IpInfoInterface } from '../interfaces/ip-info.interface';
import { Request } from 'express';
import { UserAgentInterface } from '../interfaces/user-agent.interface';

const ipInfo = `https://ipinfo.io/`;

export const getIpAddress = async (request: Request) => {
  try {
    let [ipAddress]: string[] | string = <string>(
      request.headers['x-forwarded-for']
    )
      ? (<string>request.headers['x-forwarded-for']).split(',')
      : '127.0.0.1';
    return ipAddress;
  } catch (error) {
    Logger.error(error.message);
    return null;
  }
};

export const getIpInfo = async (request: Request) => {
  try {
    const ipAddress = await getIpAddress(request);
    const { data } = await axios.get<IpInfoInterface>(`${ipInfo}${ipAddress}`);
    return data;
  } catch (error) {
    Logger.error(error.message);
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
    return { ipInfo, userAgent: filterUserAgent(request.useragent) };
  },
);
