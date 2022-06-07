const express = require("express");
const expressFileUpload = require("express-fileupload")
const {getUsers, createUser, loginUser, updateUser, getUserId,checkUser, deleteUser } = require("../controllers/user.controller");
const requiereAuth = require("../middlewares/requiereAuth");
const requireDatos = require("../middlewares/requireDatos");

const router = express.Router();

// midleware
router.use(expressFileUpload())
router.use(express.urlencoded({extended: true}))


// i4. La vista correspondiente a la ruta raíz debe mostrar todos los participantes registrados y su estado de revisión
// http://localhost:3000/api/v1/participantes
router.get("/participantes", getUsers)

// i1. Debes crear un sistema que permita registrar nuevos participantes.
router.post("/participantes", requireDatos ,createUser)

// i2.Debes crear una vista para que los participantes puedan iniciar sesión con su correo y contraseña.
router.post("/login", loginUser)

//i3. los participantes deberán poder modificar sus datos, exceptuando el correo electrónico y su foto.
router.put("/update",requiereAuth,updateUser)
router.get("/update",requiereAuth, getUserId )

//i5.La vista del administrador debe mostrar los participantes registrados y permitir aprobarlos para cambiar su estado.
router.post("/check", checkUser)

// delete
router.delete("/delete/:id" , deleteUser)

module.exports = router;