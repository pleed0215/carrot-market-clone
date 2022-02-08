import { NextApiHandler } from 'next';
import withHandler from '@libs/server/withHandler';
import CarrotResponse from '@libs/server/carrotResponse';
import prismaClient from '@libs/server/prisma';

const post: NextApiHandler = async (req, res) => {
    const { id } = req.query;

    if (id) {
        const userId = req.session.user?.id;
        const hasFavorite = await prismaClient.favorite.findUnique({
            where: {
                userId,
            },
        });
        if (hasFavorite) {
            const exist = await prismaClient.product.findFirst({
                where: {
                    favorites: {
                        some: {
                            userId,
                            favorites: {
                                some: {
                                    id: +id,
                                },
                            },
                        },
                    },
                },
            });
            if (exist) {
                await prismaClient.favorite.update({
                    where: {
                        id: hasFavorite.id,
                    },
                    data: {
                        favorites: {
                            disconnect: {
                                id: +id,
                            },
                        },
                    },
                });
            } else {
                await prismaClient.favorite.update({
                    where: {
                        id: hasFavorite.id,
                    },
                    data: {
                        favorites: {
                            connect: {
                                id: +id,
                            },
                        },
                    },
                });
            }
        } else {
            await prismaClient.favorite.create({
                data: {
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                    favorites: {
                        connect: {
                            id: +id,
                        },
                    },
                },
            });
        }
        return res.status(201).send(CarrotResponse.builder(201).build());
    } else {
        return res.status(400).send(CarrotResponse.factory(400));
    }
};

const get: NextApiHandler = async (req, res) => {
    const { id } = req.query;
    if (id) {
        const existOnFav = await prismaClient.product.findFirst({
            where: {
                favorites: {
                    some: {
                        userId: req.session?.user?.id ?? -1,
                        favorites: {
                            some: {
                                id: +id,
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).send({ isFav: Boolean(existOnFav) });
    } else {
        return res.status(400).send(CarrotResponse.factory(400));
    }
};

export default withHandler({ post, get, options: { needAuth: true } });
