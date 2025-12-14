const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token ausente ou malformado" });
    }

    const token = auth.split(' ')[1];

    try {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET não definido");
        }

        const payload = jwt.verify(token, JWT_SECRET);
        console.log("Payload do token:", payload);
        req.user = { 
            id_usuario: payload.id_usuario, 
            tipo_usuario: payload.tipo_usuario || payload.tipo
        };

        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = { authMiddleware };
