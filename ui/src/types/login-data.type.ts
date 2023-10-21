export type LoginDataType = {
  id: number;
  ip: string;
  location: string;
  timezone: string;
  userAgent: userAgentType;
  event: string;
  createdAt: string;
  updatedAt: string;
};

export type userAgentType = {
  browser: string;
  version: string;
  os: string;
  platform: string;
  source: string;
};
