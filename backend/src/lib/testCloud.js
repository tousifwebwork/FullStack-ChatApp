const cloud = require('./cloudinary');

async function test(){
try{
const res = await cloud.api.ping();
console.log('Cloudinary Working:', res);
}catch(err){
    console.error('Cloudinary test error:');
}
}

test();