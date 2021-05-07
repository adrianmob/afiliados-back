const router = require('express').Router();
const {
  crearAfiliado,
  obtenerAfiliado,
  obtenerAfiliados,
  modificarAfiliado,
  iniciarSesion
//   eliminarAfiliado
} = require('../controllers/afiliados')

router.get('/', obtenerAfiliados)
router.get('/:id', obtenerAfiliado) //Nuevo endpoint con todos los detalles de Afiliado
router.post('/', crearAfiliado)
router.put('/:id', modificarAfiliado)
// router.delete('/:id', eliminarAfiliado)
router.post('/login', iniciarSesion)

module.exports = router;