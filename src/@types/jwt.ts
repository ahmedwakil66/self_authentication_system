/*
 * Ankur Mursalin
 *
 * https://encryptioner.github.io/
 *
 * Created on Sat Aug 24 2024
 */

import { UserRole } from '@/models/userModel';

export type EncodedPayload = {
  id: string;
  email: string;
  role?: string[];
};

export type DecodedPayload = {
  id: string;
  email: string;
  role?: UserRole[];
  iat: number;
  exp: number;
};
