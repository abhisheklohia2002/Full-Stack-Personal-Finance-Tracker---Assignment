import fs from 'fs';
import rsaPemToJwk from 'rsa-pem-to-jwk';


const privatekey = fs.readFileSync('certs/private.pem')
const jwk = rsaPemToJwk(privatekey,{use:'sig'},'public');

console.log(jwk)