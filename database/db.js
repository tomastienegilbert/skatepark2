const {Pool} = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgresql",
    database: "skatepark",
    port: 5432,
  });

// query para traer todos los usuarios
const getUsersDB = async () => {
    const client = await pool.connect()
    try{
        const respuesta = await client.query("SELECT id,nombre,email,anos_experiencia,especialidad,foto,estado FROM skaters;")
        return {
            ok:true,
            msg: respuesta.rows,
        }
    }catch(e){
        console.log(e)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}

const createUserDB = async (nombre,hashPassword,email,experiencia,especialidad,pathFoto) => {
    const client = await pool.connect()
    const query = {
        text: "INSERT INTO skaters (nombre,email,password,anos_experiencia,especialidad,foto) VALUES($1,$2,$3,$4,$5,$6) RETURNING*",
        values:[nombre,email,hashPassword,experiencia,especialidad,pathFoto]
    }
    try{
        const respuesta = await client.query(query)
        const {id,} = respuesta.rows[0]
        return {
            ok:true,
            id
            // msg: respuesta.rows[0],
        }
    }catch(e){
        console.log(e)
        if(e.code == '23505'){
            return {
                ok:false,
                msg: `Email '${email}' ya esta registrado`,
            }
        }
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}

const getUserDB = async(email) => {
    const client = await pool.connect()
    const query = {
        text: "SELECT * FROM skaters WHERE email = $1 ",
        values:[email]
    }
    try{
        const respuesta = await client.query(query)
        return {
            ok:true,
            user: respuesta.rows[0],
        }
    }catch(e){
        console.log(e)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}

const updateUserDB = async(body, id) => {
    const client = await pool.connect()
    const query1 = {
        text: `SELECT * FROM skaters WHERE id = $1`,
        values:[id]
    }
    try{
        const resOriginal = await client.query(query1)
        const dataOriginal = resOriginal.rows[0]
        
    if(body.password){
        body.password = await bcrypt.hash(body.password,10)
    }
        const passwordUpdate = {
            password: body.password || dataOriginal.password
        }

        const query2 = {
            text: "UPDATE skaters SET nombre = $1, password = $2 , anos_experiencia = $3 , especialidad = $4 WHERE id = $5 RETURNING*",
            values:[body.nombre, passwordUpdate.password , body.experiencia, body.especialidad, id]
        }
        const respuesta = await client.query(query2)

        return {
            ok:"true",
            user: respuesta.rows,
        }
    }catch(error){
        console.log(error)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}


const getUserIdDB = async(id) => {
    const client = await pool.connect()
    const query = {
        text: "SELECT * FROM skaters WHERE id = $1 ",
        values:[id]
    }
    try{
        const respuesta = await client.query(query)
        // console.log(respuesta.rows)
        return {
            ok:true,
            user: respuesta.rows[0],
        }
    }catch(e){
        console.log(e)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}

const checkUserDB = async(id) => {
    const client = await pool.connect()
    const query = {
        text: "UPDATE skaters SET estado = true WHERE id = $1 RETURNING*",
        values:[id]
    }
    try{
        const respuesta = await client.query(query)
        return {
            ok:true,
            user: respuesta.rows[0],
        }
    }catch(e){
        console.log(e)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}

const deleteDB = async(id) => {
    const client = await pool.connect()
    const query = {
        text: "DELETE from skaters WHERE id= $1 RETURNING*",
        values:[id]
    }
    try{
        const respuesta = await client.query(query)

        return {
            ok:true,
            user: respuesta.rows[0],
        }
    }catch(e){
        console.log(e)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}


module.exports ={
    getUsersDB,
    createUserDB,
    getUserDB,
    updateUserDB,
    getUserIdDB,
    checkUserDB,
    deleteDB
}