const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '10000h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar JWT.');
            } else {
                resolve(token);
            }

        });
    });
}

module.exports = {
    generarJWT
}