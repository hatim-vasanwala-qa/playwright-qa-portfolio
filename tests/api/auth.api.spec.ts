import { expect, test } from '../../fixtures/test-fixtures';
import type { ApiErrorResponse, AuthLoginResponse, UserProfile } from '../../api/types';
import { ENV } from '../../config/env';

test.describe('Authentication REST API', () => {
  test('POST /auth/login issues JWT token and resolves authenticated profile', async ({
    apiClient,
  }) => {
    const loginResponse = await apiClient.login({
      username: ENV.apiUsername,
      password: ENV.apiPassword,
      expiresInMins: 30,
    });

    expect(loginResponse.status).toBe(200);
    const session = loginResponse.body as AuthLoginResponse;
    expect(session.username).toBe(ENV.apiUsername);
    expect(typeof session.accessToken).toBe('string');
    expect(session.accessToken.length).toBeGreaterThan(20);

    const profileResponse = await apiClient.getCurrentUser(session.accessToken);
    expect(profileResponse.status).toBe(200);
    const profile = profileResponse.body as UserProfile;
    expect(profile.id).toBe(session.id);
    expect(profile.email).toBe(session.email);
  });

  test('POST /auth/login rejects invalid credentials', async ({ apiClient }) => {
    const response = await apiClient.login({
      username: ENV.apiUsername,
      password: 'invalid-password-value',
    });

    expect(response.status).toBe(400);
    const error = response.body as ApiErrorResponse;
    expect(error.message).toBeTruthy();
  });

  test('GET /auth/me denies unauthenticated requests', async ({ apiClient }) => {
    const response = await apiClient.getCurrentUser();

    expect(response.status).toBe(401);
    const error = response.body as ApiErrorResponse;
    expect(error.message).toBeTruthy();
  });
});
