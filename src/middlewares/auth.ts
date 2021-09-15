import { JwtPayload, verify } from 'jsonwebtoken';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default (
  req: { headers: { authorization: string }; decoded: JwtPayload | undefined },
  res: unknown,
  cb: unknown
) => {
  const next = cb as (e?: unknown) => void;
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const key = process.env.AUTH_KEY ?? 'm1EAj93v2FE4pHLpIbwJegEZ7bT';
    verify(token, key, (err, decoded) => {
      req.decoded = decoded;
      next(err);
    });
  } else {
    next();
  }
};
