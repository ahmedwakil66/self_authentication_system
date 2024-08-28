/*
 * Ankur Mursalin
 *
 * https://encryptioner.github.io/
 *
 * Created on Sat Aug 24 2024
 */

export type EncodedPayload = {
  id: string;
  email: string;
};

export type DecodedPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};
