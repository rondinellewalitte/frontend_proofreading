import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from "nookies";
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';


let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies['token_dashgo']}`
    }
  });

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies(ctx);

        const { refresh_token_dashgo: refresh_token } = cookies;

        const originalConfig = error.config

        if (!isRefreshing) {
          isRefreshing = true;

          api.post("/refresh", {
            refresh_token
          }).then(response => {
            const { token } = response.data;

            setCookie(ctx, 'token_dashgo', token, {
              maxAge: 60 * 60 * 24 * 30,
              path: "/"
            })

            setCookie(ctx, 'refresh_token_dashgo', response.data.refresh_token, {
              maxAge: 60 * 60 * 24 * 30,
              path: "/"
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failedRequestsQueue.forEach(request => request.onSuccess(token))
            failedRequestsQueue = [];

          }).catch((err) => {
            failedRequestsQueue.forEach(request => request.onFailure(err))
            failedRequestsQueue = [];

            if (typeof window === 'undefined') {
              signOut();
            }
          }).finally(() => {
            isRefreshing = false;
          });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        })
      } else {
        if (typeof window === 'undefined') {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }
    return Promise.reject(error);
  })

  return api;
}