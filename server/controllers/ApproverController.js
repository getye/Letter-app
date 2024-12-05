const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../utils/jwt.helper'); 
const sendEmail = require('../utils/emailService');

const { 
    rejectLetter,
    acceptLetter,
} = require('../services/approversService');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    },
});

const rejectLetterHandler = async (req, res) => {
    try {
        const id = uuidv4();
        const user_id = req.user.userId;
        const { ref_no } = req.params;
        const { status, comment } = req.body;

        // Create the content to be signed
        const contentToSign = `${ref_no}`;

        // Sign the content
        const sign = crypto.sign("sha256", Buffer.from(contentToSign), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        }).toString('base64');

        // Call the service to store the letter and signature
        const approver = await rejectLetter(ref_no, status, comment, id, user_id, sign);

        res.status(201).json(approver);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const acceptLetterHandler = async (req, res) => {
    try {
        const id = uuidv4();
        const user_id = req.user.userId;
        const { ref_no } = req.params;
        const { status, remark } = req.body;
        console.log("status:", status)
        console.log("remark:", remark)

        // Create the content to be signed
        const contentToSign = `${ref_no}`;

        // Sign the content
        const sign = crypto.sign("sha256", Buffer.from(contentToSign), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        }).toString('base64');

        // Call the service to store the letter and signature
        const approver = await acceptLetter(ref_no, status, remark, id, user_id, sign);

        res.status(201).json(approver);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    rejectLetterHandler,
    acceptLetterHandler,
};
