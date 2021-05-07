let {DataTypes} = require('sequelize');
let {db} = require('../db');

const Afiliado = db.define('Afiliado', {
    nombre : {
        type : DataTypes.STRING
    },
    apellidoPaterno : {
        type : DataTypes.STRING
    },
    apellidoMaterno : {
        type : DataTypes.STRING
    },
    telefono : {
        type : DataTypes.STRING
    },
    email : {
        type : DataTypes.STRING
    },
    password : {
        type : DataTypes.STRING
    },
    enlace : {
        type : DataTypes.STRING
    },
    urlImagen : {
        type : DataTypes.STRING
    }
});

// publicData = () => {
//     return {
//         nombre = Afiliado.nombre,
//         apellidoPaterno = Afiliado.apellidoPaterno,
//         apellidoMaterno = Afiliado.apellidoPaterno,
//         telefono = Afiliado.telefono,
//         email = Afiliado.email,
//         enlace = Afiliado.enlace,
//         urlImagen = Afiliado.urlImagen
//     }
// }

module.exports = Afiliado;