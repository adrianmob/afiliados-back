const bcrypt = require('bcryptjs');
const generarJWT = require('../helpers/generar-jwt');
const subirIamgen = require('../helpers/subir-imagen');
const Afiliado = require('../models/Afiliado');

let obtenerAfiliados = async (req, res, next) => {
    const afiliados = await Afiliado.findAll();
    res.status(200).send(afiliados);
}

let obtenerAfiliado = async (req, res, next) =>{
    let {id} = req.params;
    const usuario = await Afiliado.findByPk(id);
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
    } 
    res.status(200).send(usuario);
}

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
        //Busca el campo de teléfono en BD
        const existeTelefono = await Afiliado.findOne({
            where : {
                telefono : body.telefono
            }
        });
        //Verifica que no exista un teléfono en la BD
        if(existeTelefono){ return res.status(400).send('Ya existe un usuario con el telefono ' + body.telefono)}
        //Busca el campo de Email en BD
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
        //Generar enlace - Falta

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
        res.status(500).send('Error del sistema, intente de nuevo más tarde o comuníquese con un asesor');
    }
}

let modificarAfiliado = async (req, res, next) =>{
    let {id} = req.params;
    let {body} = req;
    try {
        const afiliado = await Afiliado.findByPk(id);
        if (!afiliado) {
            return res.status(404).send('No existe el usuario con el id: ' + id);
        }
        if(body.telefono){
            //Busca el campo de teléfono en BD
            const existeTelefono = await Afiliado.findOne({
                where : {
                    telefono : body.telefono
                }
            });
            //Verifica que no exista un teléfono en la BD
            if(existeTelefono){ return res.status(400).send('Ya existe un usuario con el telefono ' + body.telefono)}
        }
        if(body.email){
            //Busca el campo de Email en BD
            const existeEmail = await Afiliado.findOne({
                where : {
                    email : body.email
                }
            });
            //Verifica que no exista un email en la BD
            if(existeEmail){ return res.status(400).send('Ya existe un usuario con el correo ' + body.email)}
        }
        if(body.password){
            //Cifrar contraseña
            const salt = bcrypt.genSaltSync();
            body.password = bcrypt.hashSync(body.password, salt);
        }
        let postImagen=null;
        if(body.public_id){
            //Genera firma de la imagen
            postImagen = subirIamgen(body.public_id);

        }
        //Actualiza el usuario Afiliado
        await afiliado.update(body);
        //Generar token
        const token = await generarJWT(afiliado.dataValues.email);
        //Se envían los datos al usuario
        res.status(201).send(postImagen ? {afiliado, token, postImagen} : {afiliado, token});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error del sistema, intente de nuevo más tarde o comuníquese con un asesor');
    }
}

//Función que elimina un usuario, se tiene que verificar
let eliminarAfiliado = async (req, res, next) =>{
    let {id} = req.params;
    const usuario = await Afiliado.findByPk(id);
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
    }
    //Opción de eliminar físicamente usuario
    usuario.destroy();
    //Opción de eliminar lógicamente usuario - falta

    res.status(200).send(`Usuario ${id} eliminado`);
}

module.exports = {
    obtenerAfiliados,
    obtenerAfiliado,
    crearAfiliado,
    modificarAfiliado
}