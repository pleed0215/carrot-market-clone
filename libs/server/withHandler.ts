import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import ResponseException from '@libs/server/responseExceptions';

type WithHandlerProp = {
    get?: NextApiHandler;
    post?: NextApiHandler;
    put?: NextApiHandler;
    del?: NextApiHandler;
};

const runHandler = async (
    req: NextApiRequest,
    res: NextApiResponse,
    handlerFn?: NextApiHandler,
) => {
    if (handlerFn) {
        await handlerFn(req, res);
    } else {
        res.status(405).send(ResponseException.factory(405));
    }
};

export default function withHandler({
    get,
    post,
    put,
    del,
}: WithHandlerProp): NextApiHandler {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        try {
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
                        ResponseException.factory(405, {
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
    };
}
