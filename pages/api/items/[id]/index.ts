import { NextApiHandler } from 'next';
import withHandler from '@libs/server/withHandler';
import CarrotResponse from '@libs/server/carrotResponse';
import type { Product } from '@prisma/client';
import prismaClient from '@libs/server/prisma';
import { User } from '@prisma/client';

type ItemDetailDataType = {
    item: Product & { user: User; _count: { favorites: number } };
    related: Product[];
};

const get: NextApiHandler<ItemDetailDataType | CarrotResponse> = async (
    req,
    res,
) => {
    const { id } = req.query;
    if (id) {
        const product = await prismaClient.product.findUnique({
            where: {
                id: +id,
            },
            include: {
                user: true,
                _count: {
                    select: {
                        favorites: true,
                    },
                },
            },
        });

        if (product) {
            const relatedName = product.name.split(' ');
            const relatedProducts = await prismaClient.product.findMany({
                where: {
                    OR: relatedName.map((name) => ({
                        name: { contains: name },
                    })),
                    AND: {
                        id: {
                            not: product.id,
                        },
                    },
                },
            });

            return res.status(200).send({
                item: product,
                related: relatedProducts,
            });
        } else {
            return res.status(404).send(CarrotResponse.factory(404));
        }
    } else {
        return res.status(400).send(CarrotResponse.factory(400));
    }
};

export default withHandler({ get });
