import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function withSRRGuest<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (cookies["token_dashgo"]) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        }
      }
    }

    return await fn(ctx)
  }
}