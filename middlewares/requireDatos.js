const {nanoid} = require("nanoid");

const requireDatos = (req,res,next) => {
try {
    const {nombre, password, email , experiencia, especialidad} = req.body
        
        // validacion de campos obligatorios y espacios en blanco
        if( !nombre?.trim() ||
            !password?.trim()  ||
            !email?.trim()  ||
            !experiencia?.trim()  ||
            !especialidad?.trim()  ||
            !req.files?.foto 
            ){
                throw new Error("Todos los campos son obligatorios")
            }
        
        // validaciones imagen mimetypes y size
        const {foto} = req.files;
        const mimetypes = ["image/jpeg", "image/png"]

        if(!mimetypes.includes(foto.mimetype)){
            throw new Error("Debes seleccionar solo archivos jpeg o png")
        }

        if(foto.size > 5242880 ){
            throw new Error("La imagen seleccionada no puede superar lo 5mg")
        }
        // generando un path para la foto
        const pathFoto = `${nanoid()}.${foto.mimetype.split("/")[1]}`
        req.pathFoto = pathFoto

        next()

} catch (error) {
    console.log(error)
    return res.status(400).json({
        ok:false,
        msg: error.message
    })
    }
}

module.exports = requireDatos