let crearAfiliado = (req, res, next) => {
    let body = req.body;
    res.status(201).send(body);
}

module.exports = {
    crearAfiliado
}