const bcrypt = require('bcryptjs');
const Afiliado = require('../models/Afiliado');

let obtenerAfiliados = async (req, res, next) => {
    const afiliados = await Afiliado.findAll();
    res.status(200).send(afiliados);
}

let crearAfiliado = async (req, res, next) => {
    let {body} = req;
    //Verifica que los datos necesarios vengan en la petición
    if(!body.nombre || !body.apellidoPaterno || !body.telefono || !body.email || !body.password){
        return res.status(400).send('Los datos del usuario deben estar completos');
    }
    try {
        const existeTelefono = await Afiliado.findOne({
            where : {
                telefono : body.telefono
            }
        });
        //Verifica que no exista un teléfono en la BD
        if(existeTelefono){ return res.status(400).send('Ya existe un usuario con el telefono ' + body.telefono)}
        const existeEmail = await Afiliado.findOne({
            where : {
                email : body.email
            }
        });
        //Verifica que no exista un email en la BD
        if(existeEmail){ return res.status(400).send('Ya existe un usuario con el correo ' + body.email)}
        //Cifrar contraseña
        const salt = bcrypt.genSaltSync();
        body.password = bcrypt.hashSync(body.password, salt);
        //Generar enlace
        //Guarda el usuario Afiliado
        const afiliado = new Afiliado(body);
        await afiliado.save();
        res.status(201).send(afiliado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error del sistema, intente de nuevo o comuníquese con un asesor');
    }
}

module.exports = {
    obtenerAfiliados,
    crearAfiliado
}