import { describe, expect, it } from '@jest/globals';
import { isUserRegistrationRequest } from '../helpers/refresh-exclusions';

describe('API interceptor user-route classification', () => {
  it('excludes only the public user-registration request from token refresh', () => {
    expect(isUserRegistrationRequest('/api/users', 'post')).toBe(true);
    expect(isUserRegistrationRequest('/api/users/', 'POST')).toBe(true);
    expect(isUserRegistrationRequest('/api/users?source=app', 'post')).toBe(true);
  });

  it('allows authenticated user routes to use the 401 refresh flow', () => {
    expect(isUserRegistrationRequest('/api/users/me', 'get')).toBe(false);
    expect(isUserRegistrationRequest('/api/users/me', 'patch')).toBe(false);
    expect(isUserRegistrationRequest('/api/users/profile-picture', 'delete')).toBe(false);
  });
});
