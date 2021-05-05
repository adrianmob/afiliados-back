const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const generarJWT = require('../helpers/generar-jwt');
const subirIamgen = require('../helpers/subir-imagen');
const Afiliado = require('../models/Afiliado');

let obtenerAfiliados = async (req, res, next) => {
    const afiliados = await Afiliado.findAll();
    res.status(200).send(afiliados);
}

let obtenerAfiliado = (req, res, next) =>{}

let crearAfiliado = async (req, res, next) => {
    let {body} = req;
    //Verifica que los datos necesarios vengan en la petición
    if(!body.nombre || !body.apellidoPaterno || !body.telefono || !body.email || !body.password){
        return res.status(400).send('Los datos del usuario deben estar completos');
    }
    //Verificar que el correo y el teléfono correspondan al formato
    let numTel = Number(body.telefono);
    if(body.telefono.length < 10 || Object.is(numTel, NaN)){
        return res.status(400).send('El campo teléfono debe ser un número y tener al menos 10 dígitos');
    }
    let expReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!expReg.test(String(body.email).toLowerCase())){
        return res.status(400).send('El campo email debe ser un correo válido');
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
        //Generar token
        const token = await generarJWT(afiliado.dataValues.email);
        //Genera firma de la imagen
        let postImagen = subirIamgen(body.public_id);
        //Se envían los datos al usuario
        res.status(201).send({afiliado, token, postImagen});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error del sistema, intente de nuevo o comuníquese con un asesor');
    }
}

let modificarAfiliado = (req, res, next) =>{}

let eliminarAfiliado = (req, res, next) =>{}

module.exports = {
    obtenerAfiliados,
    crearAfiliado
}