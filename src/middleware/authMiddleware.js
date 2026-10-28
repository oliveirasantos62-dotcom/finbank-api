const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token de autenticação não informado',
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return res.status(401).json({
      message: 'Formato do token inválido',
    });
  }

  try {
    const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch {
    return res.status(401).json({
      message: 'Token inválido ou expirado',
    });
  }
}

module.exports = authMiddleware;
