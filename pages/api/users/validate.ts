import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import withHandler from '@libs/server/withHandler';
import prismaClient from '@libs/server/prisma';
import CarrotResponse from '@libs/server/carrotResponse';
import withSession from '@libs/server/withSession';

const post: NextApiHandler = withSession(async (req, res) => {
    if (!req.body.hasOwnProperty('token')) {
        return res.status(400).send(
            CarrotResponse.factory(400, {
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
        req.session.user = {
            id: tokenInfo.userId,
        };
        await req.session.save();
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
});

export default withHandler({ post });
