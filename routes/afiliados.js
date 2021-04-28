const router = require('express').Router();
const {
  crearAfiliado,
//   obtenerAfiliados,
//   obtenerAfiliado,
//   modificarAfiliado,
//   eliminarAfiliado
} = require('../controllers/afiliados')

// router.get('/', obtenerAfiliados)
// router.get('/:id', obtenerAfiliado) //Nuevo endpoint con todos los detalles de Afiliado
router.post('/', crearAfiliado)
// router.put('/:id', modificarAfiliado)
// router.delete('/:id', eliminarAfiliado)

module.exports = router;