const bcrpyt = require("bcrypt");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const config = require('../config.json');   

const db = require("../helpers/db");
const sendmail = require('../helpers/sendmail');

module.exports = {
  register,
  fetchuser,
  updateuser,
  deleteuser,
  verifyemail,
  authenticate
};

async function register(value) {
  if (await db.Student.findOne({ where: { email: value.email } })) {
    return { msg: "email is exsist" };
  }
  const account = new db.Student(value);
  account.password = await hash(value.password);
  account.verifiedToken = await randoomtokenstring();
  account.save();
  await sendverifymail(value.email,account.verifiedToken);
  return { msg: "user is registerd", data: account };
  //await sendverifymail(params.email);
}

async function hash(password) {
  return await bcrpyt.hash(password, 12);
}

async function fetchuser(params) {
  const details = db.Student.findOne({ where: { id: params.id } });
  if (!details) throw "the account is not exsist";
  else {
    return details;
  }
}

async function updateuser(params,data) {
  const details = await db.Student.update(data,{ where: {id: params.id } });
  if (!details) throw "the accountis not exsists";
  else {
    return details;
  }
}

async function deleteuser(params){
    await db.Student.destroy({where:{id:params.id}}).then(data=>{
        return data;
    }).catch(error=>{
        return error
    })
}

async function randoomtokenstring(){
    return crypto.randomBytes(50).toString('hex');
}

async function verifyemail(params){
    
    const details = await db.Student.findOne({where:{verifiedToken:params}});
    if(!details) throw  'verification failed';
    details.verified = Date.now();
    details.verifiedToken = null;
    await details.save();
}


async function sendverifymail(email,token){
    const link = `http://localhost:3000/verfiy/${token}`;
   await sendmail({to:email,subject:'verfiy-Email',text:link});
}

async function authenticate(email,password){
    const user = await db.Student.findOne({where:{email:email}});
    if(!user || !user.verified || !(await bcrpyt.compare(password,user.password))){
        return  'email is incorrect';
    }
    const jwtToken = await generatetoken(user);
    
    return  ({...(alldetails(user)),jwtToken});
    

}
function alldetails(user) {
    const { id,  firstName, lastName, email,  createdAt , updatedAt,verified  } = user;
    return { id,  firstName, lastName, email,  createdAt , updatedAt,verified };
}
async function generatetoken(user){
   return await jwt.sign({id:user.id},config.secret,{expiresIn:'60m'});
}