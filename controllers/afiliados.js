const Afiliado = require('../models/Afiliado');

let obtenerAfiliados = async (req, res, next) => {
    const afiliados = await Afiliado.findAll();
    res.status(200).send(afiliados);
}

let crearAfiliado = (req, res, next) => {
    let body = req.body;
    res.status(201).send(body);
}

module.exports = {
    obtenerAfiliados,
    crearAfiliado
}