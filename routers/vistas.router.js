
const express = require("express");
const axios = require("axios")

const router = express.Router()

router.get("/", (req,res) => res.render("index"))
router.get("/admin", async (req,res) =>{
    const data = await axios.get("http://localhost:3000/api/v1/participantes")

        // console.log(data.data.msg)
        const info = data.data.msg
        return res.render("admin" , {info})
   
    
})

router.get("/datos",async(req,res) => res.render("datos"))

router.get("/login", (req,res) => res.render("login"))
router.get("/registro", (req,res) => res.render("registro"))
router.get("/delete/:id", (req,res) => res.render("delete"))


module.exports = router


