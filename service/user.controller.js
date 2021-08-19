const joi = require('@hapi/joi');
const services = require('./user.service');




module.exports.register = async (req,res,next)=>{
    const value = await services.register(req.body);
    res.send(value);
}