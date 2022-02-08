import { NextApiHandler } from 'next';
import withHandler from '@libs/server/withHandler';
import CarrotResponse from '@libs/server/carrotResponse';
import prismaClient from '@libs/server/prisma';

const get: NextApiHandler = async (req, res) => {
    try {
        const products = await prismaClient.product.findMany({
            include: {
                _count: {
                    select: {
                        favorites: true,
                    },
                },
            },
        });

        return res.status(200).send(products);
    } catch (e) {
        return res
            .status(500)
            .send(
                CarrotResponse.builder(500)
                    .setMessage('Cannot fetch items')
                    .build(),
            );
    }
};

const post: NextApiHandler = async (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
        return res.status(400).send(CarrotResponse.factory(400));
    }

    try {
        const userId = req.session.user?.id;
        const parsedPrice =
            typeof price === 'string' ? parseInt(price) : (price as number);

        const product = await prismaClient.product.create({
            data: {
                name,
                price: parsedPrice,
                description,
                image: '',
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        return res.status(201).send(product);
    } catch (e) {
        return res.status(500).send(CarrotResponse.builder(500).setData(e));
    }
};

export default withHandler({
    post,
    get,
    options: { needAuth: true, authRequestMethod: ['POST'] },
});
