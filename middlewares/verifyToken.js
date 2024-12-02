import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = (req, res, next) => {
  // const token = req.cookies['authjs.session-token'];
  console.log(req.headers.authorization.split(' '))
  const token = req.headers.authorization.split(' ')[1];
  console.log(req.headers.authorization)
  if (!token) {
    return next(createError(401, "You are not authorized!"));
  }
  try {
    const data = jwt.verify(token, "secret");
    req.user = data;
    return next();
  } catch {
    return next(createError(401, "Something went wrong"));
  }
};
