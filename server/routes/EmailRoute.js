const express = require('express');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const router = express.Router();

// Set up OAuth2 Client
const myOAuth2Client = new OAuth2Client(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET
);

myOAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

router.post('/send', async (req, res) => {
    try {
        const { email, subject, content } = req.body;
        if (!email || !subject || !content) {
            throw new Error('Please provide email, subject, and content!');
        }

        const myAccessTokenObject = await myOAuth2Client.getAccessToken();
        const myAccessToken = myAccessTokenObject?.token;

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.ADMIN_EMAIL,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refresh_token: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: myAccessToken,
            },
        });

        const mailOptions = {
            to: email,
            subject: subject,
            html: `<h3>${content}</h3>`,
        };

        await transport.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: error.message });
    }
});

module.exports = router;
