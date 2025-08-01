/* eslint-disable */

import * as crypto from 'crypto'

export function generateSHAString(key: string): string {
  const randomString = crypto.randomBytes(6).toString('hex')
  const combinedKey = key + randomString
  const hash = crypto.createHash('sha256')
  hash.update(combinedKey)
  return hash.digest('hex')
}
