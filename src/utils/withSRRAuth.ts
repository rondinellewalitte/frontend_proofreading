import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export function withSRRAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (!cookies["token_dashgo"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        }
      }
    }
    try {
      return await fn(ctx)
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'token_dashgo')
        destroyCookie(ctx, 'refresh_token_dashgo')

        return {
          redirect: {
            destination: "/",
            permanent: false,
          }
        }
      }
    }
  }
}