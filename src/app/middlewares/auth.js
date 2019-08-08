import jwt from 'jsonwebtoken';

import { promisify } from 'util'; // promisify para usar async await no jwt.verify

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // pegando informações do header
  const authHeader = req.headers.authorization;

  // verificando se token existe
  if (!authHeader) {
    return res.status(401).json({ error: 'token não enviado' });
  }

  const [, token] = authHeader.split(' '); // explode do token;

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'token invalido' });
  }

  // return next();
};
