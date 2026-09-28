import jwt from 'jsonwebtoken'
import config from '../config/env.config.js'

const generateTokens = (id) => {

    const accessToken = jwt.sign({ id }, config.ACCESS_SECRET, { expiresIn: "12m"});
    const refreshToken = jwt.sign({ id }, config.REFRESH_SECRET, {expiresIn: "7d"});

    return {accessToken, refreshToken}
}
 
export default generateTokens;