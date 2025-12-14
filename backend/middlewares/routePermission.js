const routeAccess = require("./routeAccess");

function routePermission(req, res, next) {
    const tipo = req.user?.tipo_usuario;
    const baseUrl = req.originalUrl.split("?")[0];
    const method = req.method;
    if (tipo == 'administrador') {
        return next();
    }
    const rules = routeAccess[tipo.toUpperCase()];
    if (!rules) {
        return res.status(403).json({ error: "Tipo de usuário inválido" });
    }

    // procura uma rota que combine com o prefixo
    for (const route in rules) {
        if (baseUrl.startsWith(route)) {
            if (!rules[route].includes(method)) {
                return res.status(403).json({
                    error: `Método ${method} não permitido`
                });
            }
            return next();
        }
    }

    return res.status(403).json({ error: "Acesso negado" });
};

module.exports = {routePermission};