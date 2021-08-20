const bcrpyt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

const db = require("../helpers/db");
const sendmail = require("../helpers/sendmail");
const { Op } = require("sequelize");

module.exports = {
  register,
  fetchuser,
  updateuser,
  deleteuser,
  verifyemail,
  authenticate,
  forgetpassword,
  resetpassword,
};

async function register(value) {
  if (await db.Student.findOne({ where: { email: value.email } })) {
    return { msg: "email is exsist" };
  }
  const account = new db.Student(value);
  account.password = await hash(value.password);
  account.verifiedToken = await randoomtokenstring();
  account.save();
  await sendverifymail(value.email, account.verifiedToken);
  return { msg: "verify email is send to the registered email"};
}

async function hash(password) {
  return await bcrpyt.hash(password, 12);
}

async function fetchuser(params) {
  const details = db.Student.findOne({ where: { id: params.id } });
  if (!details) return "the account is not exsist";
  else {
    return details;
  }
}

async function updateuser(params, data) {
  const details = await db.Student.update(data, { where: { id: params.id } });
  if (!details) throw "the accountis not exsists";
  else {
    return details;
  }
}

async function deleteuser(params) {
  await db.Student.destroy({ where: { id: params.id } })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
}

async function randoomtokenstring() {
  return crypto.randomBytes(50).toString("hex");
}

async function verifyemail(params) {
  const details = await db.Student.findOne({
    where: { verifiedToken: params },
  });
  if (!details) throw "verification failed";
  details.verified = Date.now();
  details.verifiedToken = null;
  await details.save();
}

async function sendverifymail(email, token) {
  const link = `http://localhost:3000/verfiy/${token}`;
  await sendmail({ to: email, subject: "verfiy-Email", text: link });
}

async function authenticate(email, password) {
  const user = await db.Student.findOne({ where: { email: email } });
  if (
    !user ||
    !user.verified ||
    !(await bcrpyt.compare(password, user.password))
  ) {
    return "email is incorrect";
  }
  const jwtToken = await generatetoken(user);

  return { ...alldetails(user), jwtToken };
}
function alldetails(user) {
  const { id, firstName, lastName, email, createdAt, updatedAt, verified } =
    user;
  return { id, firstName, lastName, email, createdAt, updatedAt, verified };
}
async function generatetoken(user) {
  return await jwt.sign({ id: user.id }, config.secret, { expiresIn: "60m" });
}

async function forgetpassword(params) {
  const details = await db.Student.findOne({ where: { email: params } });
  if (!details) return "this email is not exsist";
  details.resettoken = await randoomtokenstring();
  details.resettokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await details.save();
  await sendresetpasswordemail(details.email, details.resettoken);
}

async function sendresetpasswordemail(email, token) {
  const link = `http://localhost:3000/resetpassword/${token}`;
  await sendmail({ to: email, subject: "reset-password", text: link });
  return "reset link is send to registered email";
}
async function validateresettoken(token) {
  const details = await db.Student.findOne({
    where: {
      resettoken: token,
      resettokenExpires: { [Op.gt]: Date.now() },
    },
  });
  if (!details) throw "invalid token";

  return details;
}

async function resetpassword(token, password) {
  const details = await validateresettoken(token);
  details.password = await hash(password);
  details.resettoken = null;
  await details.save();
  return "password is reseted";
}
