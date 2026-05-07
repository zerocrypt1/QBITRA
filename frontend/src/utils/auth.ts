const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

export const isTokenExpired = (token: string) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { exp?: number };
    if (!payload.exp) {
      return false;
    }
    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
};
