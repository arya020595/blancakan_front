/**
 * Auth module exports (Client-safe only)
 * Note: ServerAuthService is not exported here because it uses next/headers
 * Import ServerAuthService directly from './server-auth-guard' in server components only
 */

export { AuthConditional, useAuthGuard, withClientAuth } from './client-auth-guard';
export {
    getAuthToken, getTokenPayload, isTokenExpired, removeAuthToken, setAuthToken
} from './token-manager';

