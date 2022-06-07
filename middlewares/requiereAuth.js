require("dotenv").config()
const jwt = require("jsonwebtoken")
const requiereAuth = (req,res, next) => {
    try {
        
        if (!req.headers?.authorization) {
            throw new Error("No existe el token");
        }

        const token = req.headers.authorization.split(' ')[1]
        // if(!token){
        //     throw new Error("No existe token, formato no valido")

        // }
        const payload = jwt.verify(token, process.env.JWT_SECRET)
       
        req.payload = payload.id

        next()
    } catch (error) {
        // console.log(error)
        return res.status(401).json({
            ok:false,
            msg: error.message
        })
        }
    }

module.exports = requiereAuth