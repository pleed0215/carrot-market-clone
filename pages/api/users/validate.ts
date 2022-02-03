import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import withHandler from '@libs/server/withHandler';
import ResponseException from '@libs/server/responseExceptions';
import prismaClient from '@libs/server/prisma';
import CarrotResponse from '@libs/server/carrotResponse';

const post: NextApiHandler = async (req, res) => {
    if (!req.body.hasOwnProperty('token')) {
        return res.status(400).send(
            ResponseException.factory(400, {
                path: req.url,
                description: 'Token not given',
            }),
        );
    }
    const { token } = req.body;

    const tokenInfo = await prismaClient.token.findUnique({
        where: {
            payload: token,
        },
    });
    if (tokenInfo) {
        return res.status(201).send(
            CarrotResponse.builder(201)
                .setMessage('Success on validation')
                .setData({
                    successOnValidation: true,
                    userId: tokenInfo.userId,
                }),
        );
    } else {
        return res.status(404).send(
            CarrotResponse.builder(404)
                .setMessage('Failed on validation')
                .setData({
                    successOnValidation: false,
                }),
        );
    }
};

export default withHandler({ post });
