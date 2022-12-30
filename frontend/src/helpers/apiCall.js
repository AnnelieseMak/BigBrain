import { BACKEND_PORT } from '../config.json';

const apiCall = async (path, method, body) => {
  try {
    const response = await fetch(`http://localhost:${BACKEND_PORT}/${path}`, {
      method: method,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization:
          path === 'auth/admin/login' ||
          path === 'auth/admin/register' ||
          path.includes('play')
            ? undefined
            : sessionStorage.getItem('authToken'),
      },
      body: method === 'GET' ? undefined : JSON.stringify(body),
    });
    return response;
  } catch (err) {
    console.log('ERROR, method: ', method, 'body: ', JSON.stringify(body));
  }
};
export default apiCall;
