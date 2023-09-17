import _ from 'lodash';
import crypto from 'crypto';
import { Product, Price } from './types';

export function generateProductHash(product: Product): string {
  let hashFields: string[];
  // keep AWS product hashes the same so Infracost tests don't break
  if (product.vendorName === 'aws') {
    hashFields = ['vendorName', 'sku'];
  } else {
    hashFields = ['vendorName', 'region', 'sku'];
  }

  const hashableValues = _.values(_.pick(product, hashFields));
  return crypto
    .createHash('md5')
    .update(hashableValues.join('-'))
    .digest('hex');
}

export function generatePriceHash(product: Product, price: Price): string {
  let hashExtra = '';
  let hashFields: string[];
  // keep AWS price hashes the same so Infracost tests don't break
  if (product.vendorName === 'aws') {
    hashFields = [
      'purchaseOption',
      'unit',
      'termLength',
      'termPurchaseOption',
      'termOfferingClass',
    ];

    // As of March 2023, AWS seems to be sending some overlapping Cloudfront
    // regionless products from the US and China pricing endpoints.  We need
    // to make sure the pricehash accounts for this so the prices can be
    // properly merged, otherwise the CNY prices will clobbed the USD prices.
    //
    // We also don't want to modify existing USD prices if we can avoid it.
    // So this complicates the hashing function, but it is probably worth it:
    if (
      product.region === null &&
      price.USD === undefined &&
      price.CNY !== undefined
    ) {
      hashExtra = '-cny';
    }
  } else {
    hashFields = [
      'purchaseOption',
      'unit',
      'startUsageAmount',
      'endUsageAmount',
      'termLength',
      'termPurchaseOption',
      'termOfferingClass',
    ];
  }

  const hashableValues = _.values(_.pick(price, hashFields));

  const hash = crypto
    .createHash('md5')
    .update(hashableValues.join('-'))
    .digest('hex');
  return `${product.productHash}-${hash}${hashExtra}`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function camelKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelKeys(v));
  }
  if (_.isPlainObject(obj)) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [_.camelCase(key)]: camelKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
