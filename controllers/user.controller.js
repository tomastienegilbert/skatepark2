require("dotenv").config()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { getUsersDB, createUserDB , getUserDB, updateUserDB, getUserIdDB, deleteDB, checkUserDB} = require("../database/db");
const path = require("path"); //modulo nativo para interpretar rutas 


const getUsers = async (req,res) => {
    const respuesta = await getUsersDB();
    if(!respuesta.ok){
        return res.status(500).json({
            ok:false,
            msg: respuesta.msg})
    }
    return res.json({
        ok:true,
        msg: respuesta.msg})

}

const createUser = async (req,res) => {
    
    try {
        const {nombre, password, email , experiencia, especialidad} = req.body
        
        // hashear contraseña para guardar en db
        
        const salt = await bcrypt.genSalt(10) //generamos los saltos 
        const hashPassword = await bcrypt.hash(password,salt) //hashear contraseña
        
        // creacion usuario en database
        const pathFoto = req.pathFoto
        const respuesta = await createUserDB(nombre,hashPassword,email,experiencia,especialidad,pathFoto)
        
        // verificacion de usuario correctamente 
        if(!respuesta.ok) throw new Error(respuesta.msg);
        
        
        // guardar imagen 
        const rutaFoto = path.join(__dirname,"../public/imgs",req.pathFoto) //path.join para unir e interpretar ruta 
        const {foto} = req.files;
        
        foto.mv(rutaFoto , (err) =>{
            if(err) throw new Error("Error al cargar la imagen")
            
        })

        // jsonwebtoken
        const payload = {id : respuesta.id}
        // console.log(payload)
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "24h"})

        return res.json({
            ok:true,
            token
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            ok:false,
            msg: error.message
        })

    }
 }

const loginUser = async(req,res) => {
    try {
        const {email, password} = req.body;
        // validacion campos del login no funciona con body raw, solo con form-data
        if(!email?.trim() ||
            !password?.trim()){
                throw new Error("Todos los campos son obligatorios")
            }
        // validar que email existe
        const respuesta = await getUserDB(email)
        if(!respuesta.ok){
            throw new Error(respuesta.msg)
        }
        if(!respuesta.user){
            throw new Error("No existe el email registrado")

        }
        // validar que password existe con el hash
        const {user} = respuesta
        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword){ 
            throw new Error("Contraseña incorrecta")

         }

        // generar token
        const payload = {id : user.id}
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "24h"})

        return res.json({
            ok:true,
            token,
        })
       
        
} catch (error) {
    // console.log(error)
    return res.status(400).json({
        ok:false,
        msg: error.message
    })
    }
}

const updateUser = async(req,res) => {
   try {

    const respuesta = await updateUserDB(req.body, req.payload)
    return res.json({
        ok:true,
        respuesta,
    })

   } catch (error) {
    //    console.log(error)
    return res.status(400).json({
        ok:false,
        msg: error.message
    })
    }
   }
 
const getUserId = async (req, res) => {
    try {
        const respuesta = await getUserIdDB(req.payload);
        return res.json({
            ok:true,
            respuesta,
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            ok:false,
            msg: error.message
        })
    }
}


const checkUser = async(req,res) => {
    const id = req.body.skaterID;

    try {
        const respuesta = await checkUserDB(id)
        return res.json({
            ok:true,
            respuesta,
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            ok:false,
            msg: error.message
        })
    }

}

const deleteUser = async(req,res) => {
    const {id} = req.params;
    try {
        const respuesta = await deleteDB(id)
        return res.json({
            ok:true,
            respuesta,
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            ok:false,
            msg: error.message
        })
    }
    }


module.exports = {
    getUsers,
    createUser,
    loginUser,
    updateUser,
    getUserId,
    checkUser,
    deleteUser
}