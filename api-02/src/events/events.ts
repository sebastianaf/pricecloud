import axios from 'axios';
import { Request } from 'express';
import _ from 'lodash';
import config from '../config';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function forwardEvent(req: Request): Promise<void> {
  if (config.disableTelemetry) {
    return;
  }

  // Only forward run events
  if (req.body?.event !== 'infracost-run') {
    return;
  }

  // Only forward the following attributes
  const attrs = [
    'ciPlatform',
    'ciScript',
    'fullVersion',
    'installId',
    'version',
  ];

  const body = {
    event: req.body.event,
    env: {
      ..._.pick(req.body?.env || {}, attrs),
      isSelfHosted: true,
    },
  };

  try {
    const headers: { [key: string]: any } = {
      'X-Api-Key': config.infracostAPIKey || '',
      'X-Cloud-Pricing-Api-Version': process.env.npm_package_version || '',
    };

    if (req.header('x-infracost-trace-id') != null) {
      headers['x-infracost-trace-id'] = req.header('x-infracost-trace-id');
    }

    await axios.post(`${config.infracostDashboardApiEndpoint}/event`, body, {
      headers,
    });
  } catch (err) {
    config.logger.error(`Error forwarding event to Infracost API: ${err}`);
  }
}

export async function sendEvent(event: string, env?: any): Promise<void> {
  if (config.disableTelemetry) {
    return;
  }

  try {
    await axios.post(
      `${config.infracostDashboardApiEndpoint}/event`,
      {
        event,
        env: {
          cloudPricingAPIVersion: process.env.npm_package_version,
          ...(env || {}),
        },
      },
      {
        headers: {
          'X-Api-Key': config.infracostAPIKey || '',
          'X-Cloud-Pricing-Api-Version': process.env.npm_package_version || '',
        },
      }
    );
  } catch (err) {
    config.logger.error(`Error sending event to Infracost API: ${err}`);
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
