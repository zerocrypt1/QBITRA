export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    sendOtp: '/auth/otp/send',
    verifyOtp: '/auth/otp/verify',
  },
  users: {
    me: '/users/me',
    avatar: '/users/avatar',
  },
  problems: {
    list: '/problems',
    create: '/problems',
  },
  submissions: {
    submit: '/submissions',
    mine: '/submissions/mine',
  },
  contests: {
    list: '/contests',
    create: '/contests',
    register: (id: string) => `/contests/${id}/register`,
  },
  comments: {
    list: '/comments',
    create: '/comments',
    like: (id: string) => `/comments/${id}/like`,
  },
};
