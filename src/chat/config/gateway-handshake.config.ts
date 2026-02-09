import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

export default registerAs(
  'gateway-key',
  (): JwtSignOptions => ({
    secret: process.env.GATEWAY_SECRET_KEY,
    expiresIn: process.env.GATEWAY_TOKEN_EXPIRES_IN as StringValue,
  }),
);
