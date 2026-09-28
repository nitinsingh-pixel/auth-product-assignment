import jwt from 'jsonwebtoken'
import config from '../config/env.config.js'

export const verifyAcessToken = (token) => {

    const decoded = jwt.verify(token, config.ACCESS_SECRET);
    return decoded
}

export const verifyRefreshToken = (token) => {

    const decoded = jwt.verify(token, config.REFRESH_SECRET);
    return decoded
}