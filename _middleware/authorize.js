const jwt  = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize() {
    return [
        // autenticar o token JWT e anexar o token decodificado para solicitar como req.user
        jwt({ secret, algorithms: ['HS256'] }),

        // anexar registro completo do usuário ao objeto de solicitaçãot
        async (req, res, next) => {
            // obter usuário com id da propriedade token 'sub' (assunto)
            const user = await db.User.findByPk(req.user.sub);

            // verifique se o usuário ainda existe
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });

            // autorização bem sucedida
            req.user = user.get();
            next();
        }
    ];
}