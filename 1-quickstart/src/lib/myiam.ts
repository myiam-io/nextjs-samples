import { createMyiamServer } from '@myiam.io/web-sdk/server'

export const myiam = createMyiamServer({
  serviceUid: process.env.SERVICE_UID!,
  oauth2ClientId: process.env.OAUTH2_CLIENT_ID!,
  cookieSecret: process.env.COOKIE_SECRET!,
  apiKey: process.env.API_KEY!,
})
