import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { IronSessionOptions } from 'iron-session';

declare module 'iron-session' {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}

export default function withSession(
    apiHandler: NextApiHandler,
    options?: IronSessionOptions,
) {
    return withIronSessionApiRoute(
        apiHandler,
        options
            ? options
            : {
                  cookieName: process.env.COOKIE_NAME,
                  password: process.env.SECRET_KEY,
                  cookieOptions: {
                      secure: process.env.NODE_ENV === 'production',
                  },
              },
    );
}
