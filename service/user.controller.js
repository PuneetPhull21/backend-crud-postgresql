const joi = require('@hapi/joi');
const string = require('@hapi/joi/lib/types/string');
const services = require('./user.service');


const  registerschema = joi.object({
    email:joi.string().required(),
    password:joi.string().required(),
    firstName:joi.string().required(),
    lastName:joi.string().required()
})

module.exports.register = async (req,res,next)=>{
    const details = await registerschema.validateAsync(req.body)
     await services.register(details).then((data)=>{
         res.json(data);
     })
}

module.exports.fetch = async (req,res,next)=>{
   await services.fetchuser(req.params).then((data)=>{
       res.json(data);
   })
}
const  updateschema = joi.object({
    email:joi.string().required(),
    firstName:joi.string().required(),
    lastName:joi.string().required()
})
module.exports.update = async (req,res,next)=>{
    const details = await updateschema.validateAsync(req.body);
    await services.updateuser(req.params,details).then(data=>{
        res.json(data);
    })
}

module.exports.delete = async (req,res,next)=>{
    await services.deleteuser(req.params).then(data=>{
        res.send(data);
    }).catch(next);
}

module.exports.verifyemail = async (req,res,next)=>{
    await services.verifyemail(req.params.token).then(()=>{
        res.send('user is verified');
    })
}

const loginschema = joi.object({
    email:joi.string().required(),
    password:joi.string().required(),
})

module.exports.login = async(req,res,next)=>{
    const user = await loginschema.validateAsync(req.body);
    await services.authenticate(user.email,user.password).then(data=>{
        res.send(data);
    })
}

module.exports.forgetpassword = async (req,res,next)=>{
    await services.forgetpassword(req.body.email).then(data=>{
        res.send(data);
    })
}
module.exports.resetpassword = async (req,res,next)=>{
    await services.resetpassword(req.params.token,req.body.password).then((data)=>{
        res.send(data)
    })
}
