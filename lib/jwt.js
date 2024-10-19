import { json } from 'express';
import jsonwebtoken from 'jsonwebtoken'
import util from 'util';

 const verify = util.promisify(jsonwebtoken.verify);
 const sign = util.promisify(jsonwebtoken.sign);
 const decode = util.promisify(jsonwebtoken.decode);

const jwt = {
    verify,
    sign,
    decode,
    
}

export default jwt;