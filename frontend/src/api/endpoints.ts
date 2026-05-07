export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
  },
  problems: {
    list: '/problems',
    byId: (id: string) => `/problems/${id}`,
  },
  contests: {
    list: '/contests',
  },
  leaderboard: {
    list: '/leaderboard',
  },
};
