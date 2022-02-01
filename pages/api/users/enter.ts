import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import withHandler from '@libs/server/withHandler';
import ResponseException from '@libs/server/responseExceptions';
import prismaClient from '@libs/server/prisma';
import CarrotResponse from '@libs/server/carrotResponse';

const post: NextApiHandler = async (req, res) => {
    const { email, phone } = req.body;
    try {
        if ((email && phone) || !(email || phone)) {
            res.status(400).send(
                ResponseException.factory(400, {
                    path: req.url,
                    description: 'Wrong input',
                }),
            );
        }
        const userPayload = email ? { email } : { phone: +phone };
        const tokenPayload = Math.floor(1000000 + Math.random() * 99999) + '';
        const existUser = await prismaClient.user.findFirst({
            where: {
                ...userPayload,
            },
        });
        if (existUser) {
            return res.status(400).send(
                ResponseException.factory(400, {
                    path: req.url,
                    description: `User already exists. ${JSON.stringify(
                        userPayload,
                    )}`,
                }),
            );
        }

        const token = await prismaClient.token.create({
            data: {
                user: {
                    connectOrCreate: {
                        where: {
                            ...userPayload,
                        },
                        create: {
                            ...userPayload,
                            name: 'Anonymous',
                        },
                    },
                },
                payload: tokenPayload,
            },
        });

        return res
            .status(201)
            .send(
                CarrotResponse.builder(201)
                    .setPath(req.url)
                    .setDescription('User is successfully made')
                    .setMessage('OK')
                    .build(),
            );
    } catch (e) {
        res.status(500).send(ResponseException.factory(500, { path: req.url }));
    }
};

export default withHandler({ post });
