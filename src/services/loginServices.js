import createHttpError from 'http-errors';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Session from '../db/models/sessionModel.js';
import User from '../db/models/User.js';
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
} from '../constants/loginConstants.js';

export const loginUser = async (email, password) => {
  const maybeUser = await User.findOne({ email });

  if (maybeUser === null) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(password, maybeUser.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: maybeUser._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return await Session.create({
    userId: maybeUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
};
