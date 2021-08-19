const bcrpyt = require('bcrypt');
const crypto = require('crypto');



const db = require('../helpers/db');

module.exports = {
    register,
    fetchuser
}



async function register (value){
    if(await db.Student.findOne({where:{email:value.email}})){
        return ({msg:"email is exsist"});
    }
    const account = new db.Student(value);
    account.passwordHash = await hash(value.password);
     account.save();
     return ({msg:"user is registerd",data:account});
     //await sendverifymail(params.email);
}

async function hash(password){
    return await bcrpyt.hash(password,12);
}

async function fetchuser(params){
   const details = db.Student.findByPk({where:{id:params.id}});
   return ({message:"user is fetch",data:details});
}



