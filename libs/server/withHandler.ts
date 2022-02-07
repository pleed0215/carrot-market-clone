import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import CarrotResponse from '@libs/server/carrotResponse';
import withSession from '@libs/server/withSession';

type RequestType = 'POST' | 'PUT' | 'GET' | 'DELETE';
type AuthRequestType = Array<RequestType>;

type WithHandlerProp = {
    get?: NextApiHandler;
    post?: NextApiHandler;
    put?: NextApiHandler;
    del?: NextApiHandler;
    options?: {
        // needAuth만 제공되면 모든 메소드에 대한 authentication을 확인.
        // authRequestMethod가 같이 제공되면, 제공된 메소드만 authentication 점검.
        needAuth?: boolean;
        authRequestMethod?: AuthRequestType;
    };
};

const runHandler = async (
    req: NextApiRequest,
    res: NextApiResponse,
    handlerFn?: NextApiHandler,
) => {
    if (handlerFn) {
        await handlerFn(req, res);
    } else {
        res.status(405).send(CarrotResponse.factory(405));
    }
};

export default function withHandler({
    get,
    post,
    put,
    del,
    options,
}: WithHandlerProp): NextApiHandler {
    return withSession(async function (
        req: NextApiRequest,
        res: NextApiResponse,
    ) {
        try {
            if (options) {
                const { authRequestMethod, needAuth } = options;
                if (needAuth) {
                    // authRequestMethod가 제공되었을 때에는 해당 메소드만 점검
                    // 제공되지 않았을 때에는 모든 메소드를 점검.
                    let needCheckSession =
                        !authRequestMethod ||
                        authRequestMethod.includes(
                            req.method?.toUpperCase() as RequestType,
                        );

                    if (needCheckSession) {
                        if (!req.session || !req.session.user) {
                            return res.status(401).send(
                                CarrotResponse.factory(401, {
                                    message: 'Unauthorized Error',
                                }),
                            );
                        }
                    }
                }
            }
            switch (req.method) {
                case 'GET':
                    await runHandler(req, res, get);
                    break;
                case 'POST':
                    await runHandler(req, res, post);
                    break;
                case 'PUT':
                    await runHandler(req, res, put);
                    break;
                case 'DELETE':
                    await runHandler(req, res, del);
                    break;
                default:
                    res.status(405).send(
                        CarrotResponse.factory(405, {
                            path: req.url,
                            description: 'Wrong method provided',
                        }),
                    );
                    break;
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    });
}
