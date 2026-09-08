export const isUserRegistrationRequest = (url: string, method?: string) => {
  const path = url.split('?')[0].replace(/\/+$/, '');
  return method?.toLowerCase() === 'post' && path === '/api/users';
};
