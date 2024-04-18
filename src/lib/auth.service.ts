import { GetServerSidePropsContext, NextPageContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";

type Listner = (state: string | null) => void;
type Context = GetServerSidePropsContext | NextPageContext;

export class AuthService {
	private listners = new Set<Listner>();
	private ctx: Context | null = null;

	getToken() {
		const cookies = parseCookies(this.ctx);
		return cookies.access_token;
	}

	getRefreshToken() {
		const cookies = parseCookies(this.ctx);
		return cookies.refresh_token;
	}

	setToken(token: string) {
		setCookie(this.ctx, "access_token", token, {
			maxAge: 1 * 24 * 60 * 60,
			path: "/",
		});
		this.listners.forEach((listner) => listner(token));
	}

	removeToken() {
		destroyCookie(this.ctx, "access_token", {
			path: "/",
		});
		this.listners.forEach((listner) => listner(null));
	}

	listen(listner: Listner) {
		this.listners.add(listner);
		return () => this.listners.delete(listner);
	}

	setContext(ctx: Context) {
		this.ctx = ctx;
	}

	resetContext() {
		this.ctx = null;
	}
}

export const authService = new AuthService();
