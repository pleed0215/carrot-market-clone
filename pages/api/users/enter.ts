import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import withHandler from '@libs/server/withHandler';
import prismaClient from '@libs/server/prisma';
import CarrotResponse from '@libs/server/carrotResponse';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const post: NextApiHandler = async (req, res) => {
    const { email, phone } = req.body;
    try {
        if ((email && phone) || !(email || phone)) {
            res.status(400).send(
                CarrotResponse.factory(400, {
                    path: req.url,
                    description: 'Wrong input',
                }),
            );
        }
        const userPayload = email ? { email } : { phone: +phone };
        const tokenPayload = Math.floor(100000 + Math.random() * 899999) + '';
        const existUser = await prismaClient.user.findFirst({
            where: {
                ...userPayload,
            },
        });
        if (existUser) {
            return res.status(400).send(
                CarrotResponse.factory(400, {
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

        if (phone) {
            await twilioClient.messages.create({
                messagingServiceSid: process.env.TWILIO_SERVICE_ID,
                to: '+82' + phone,
                body: `Your login token is: ${tokenPayload}`,
            });
        } else {
            if (process.env.SENDGRID_API_KEY) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                const msg: MailDataRequired = {
                    to: email,
                    from: 'pleed0215@bizmeka.com',
                    subject: 'Sending with SendGrid is suck',
                    html: `<strong>Your authentication token: ${tokenPayload}</strong>`,
                };
                const response = await sgMail.send(msg);
            }
        }

        return res.status(201).send(
            CarrotResponse.builder(201)
                .setPath(req.url)
                .setDescription('User is successfully made')
                .setMessage('OK')
                .setData({
                    token: tokenPayload,
                })
                .build(),
        );
    } catch (e) {
        res.status(500).send(CarrotResponse.factory(500, { path: req.url }));
    }
};

export default withHandler({ post });
