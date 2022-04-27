import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/apiClient";
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from "nookies"

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  user: User;
};

type AuthProviderProps = {
  children: ReactNode;
}

type User = {
  username: string;
  email: string;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel

export function signOut() {
  destroyCookie(undefined, 'token_dashgo');
  destroyCookie(undefined, 'refresh_token_dashgo');

  /* authChannel.postMessage('signOut');*/

  Router.push("/")
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;
  /*
    useEffect(() => {
      authChannel = new BroadcastChannel('auth')
  
      authChannel.onmessage = (message) => {
        switch (message.data) {
          case 'signOut':
            signOut();
            break;
          default:
            break;
        }
      }
    }, [])
    */

  useEffect(() => {
    const { token_dashgo } = parseCookies()

    if (token_dashgo) {
      api.get("/me").then(response => {
        setUser({
          email: response.data.email,
          username: response.data.username,
        })
      }).catch(() => {
        signOut();
      })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/autheticate', {
        email,
        password
      })

      const { username } = response.data.user;
      const { refresh_token, token } = response.data;

      setCookie(undefined, 'token_dashgo', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      })

      setCookie(undefined, 'refresh_token_dashgo', refresh_token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      })


      setUser({
        email,
        username,
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}