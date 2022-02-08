import { NextApiHandler } from 'next';
import withHandler from '@libs/server/withHandler';
import CarrotResponse from '@libs/server/carrotResponse';
import prismaClient from '@libs/server/prisma';

const get: NextApiHandler = async (req, res) => {
    if (req.session && req.session.user) {
        const user = await prismaClient.user.findUnique({
            where: {
                id: req.session.user.id,
            },
        });
        if (user) {
            return res.status(200).send(
                CarrotResponse.builder(200)
                    .setData({
                        user,
                    })
                    .build(),
            );
        } else {
            return res.status(404).send(
                CarrotResponse.factory(404, {
                    message: 'Cannot find user',
                }),
            );
        }
    } else {
        return res.status(403).send(CarrotResponse.factory(403));
    }
};

export default withHandler({
    get,
    options: {
        needAuth: true,
        authRequestMethod: ['GET'],
    },
});
