import config from "./env.config.js";
import imagekit from 'imagekit'


const imageKit = new imagekit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT

})

export default imageKit;