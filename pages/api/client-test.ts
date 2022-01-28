import { NextApiHandler } from "next";
import prismaClient from "../../libs/prisma";

const handler:NextApiHandler = (req, res) => {
    const users = prismaClient.user.findMany({});
    res.send(users);
}

export default handler;