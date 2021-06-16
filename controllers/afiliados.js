const bcrypt = require("bcryptjs");
const generarJWT = require("../helpers/generar-jwt");
const Afiliado = require("../models/Afiliado");

let obtenerAfiliados = async (req, res, next) => {
  try {
    const afiliados = await Afiliado.findAll();
    res.status(200).send(afiliados);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: {
        msg:
          "Error del sistema, intente de nuevo más tarde o comuníquese con un asesor",
      },
    });
  }
};

let obtenerAfiliado = async (req, res, next) => {
  let { id } = req.params;
  try {
    const usuario = await Afiliado.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        error: {
          msg: "Usuario no encontrado",
        },
      });
    }
    res.status(200).send(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: {
        msg:
          "Error del sistema, intente de nuevo más tarde o comuníquese con un asesor",
      },
    });
  }
};

let crearAfiliado = async (req, res, next) => {
  let { body } = req;
  //Verifica que los datos necesarios vengan en la petición
  if (
    !body.nombre ||
    !body.apellidoPaterno ||
    !body.telefono ||
    !body.email ||
    !body.password ||
    !body.urlImagen
  ) {
    return res.status(400).json({
      error: {
        msg: "Los datos del usuario deben estar completos",
      },
    });
  }
  //Verificar que el correo y el teléfono correspondan al formato
  let numTel = Number(body.telefono);
  if (body.telefono.length < 10 || Object.is(numTel, NaN)) {
    return res.status(400).json({
      error: {
        msg: "El campo teléfono debe ser un número y tener al menos 10 dígitos",
      },
    });
  }
  let expReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!expReg.test(String(body.email).toLowerCase())) {
    return res.status(400).json({
      error: {
        msg: "El campo email debe ser un correo válido",
      },
    });
  }
  try {
    //Busca el campo de teléfono en BD
    const existeTelefono = await Afiliado.findOne({
      where: {
        telefono: body.telefono,
      },
    });
    //Verifica que no exista un teléfono en la BD
    if (existeTelefono) {
      return res.status(400).json({
        error: {
          msg: "Ya existe un usuario con este telefono",
          campo: body.telefono,
        },
      });
    }
    //Busca el campo de Email en BD
    const existeEmail = await Afiliado.findOne({
      where: {
        email: body.email,
      },
    });
    //Verifica que no exista un email en la BD
    if (existeEmail) {
      return res.status(400).json({
        error: {
          msg: "Ya existe un usuario con este correo",
          campo: body.email,
        },
      });
    }
    //Cifrar contraseña
    const salt = bcrypt.genSaltSync();
    body.password = bcrypt.hashSync(body.password, salt);
    //Generar enlace - Falta

    //Guarda el usuario Afiliado
    const afiliado = new Afiliado(body);
    await afiliado.save();
    //Generar token
    const token = await generarJWT(afiliado.dataValues.email);
    //Se envían los datos al usuario
    res.status(201).send({ afiliado, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: {
        msg:
          "Error del sistema, intente de nuevo más tarde o comuníquese con un asesor",
      },
    });
  }
};

let modificarAfiliado = async (req, res, next) => {
  let { id } = req.params;
  let { body } = req;
  try {
    const afiliado = await Afiliado.findByPk(id);
    if (!afiliado) {
      return res.status(404).json({
        error: {
          msg: "No existe un usuario con este id",
          campo: id,
        },
      });
    }
    if (body.telefono) {
      //Busca el campo de teléfono en BD
      const existeTelefono = await Afiliado.findOne({
        where: {
          telefono: body.telefono,
        },
      });
      //Verifica que no exista un teléfono en la BD
      if (existeTelefono) {
        return res.status(400).json({
          error: {
            msg: "Ya existe un usuario con este telefono",
            campo: body.telefono,
          },
        });
      }
    }
    if (body.email) {
      //Busca el campo de Email en BD
      const existeEmail = await Afiliado.findOne({
        where: {
          email: body.email,
        },
      });
      //Verifica que no exista un email en la BD
      if (existeEmail) {
        return res.status(400).json({
          error: {
            msg: "Ya existe un usuario con este correo",
            campo: body.email,
          },
        });
      }
    }
    if (body.password) {
      //Cifrar contraseña
      const salt = bcrypt.genSaltSync();
      body.password = bcrypt.hashSync(body.password, salt);
    }
    //Actualiza el usuario Afiliado
    await afiliado.update(body);
    //Generar token
    const token = await generarJWT(afiliado.dataValues.email);
    //Se envían los datos al usuario
    res.status(201).send({ afiliado, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: {
        msg:
          "Error del sistema, intente de nuevo más tarde o comuníquese con un asesor",
      },
    });
  }
};

//Función que elimina un usuario, se tiene que verificar
let eliminarAfiliado = async (req, res, next) => {
  let { id } = req.params;
  const usuario = await Afiliado.findByPk(id);
  if (!usuario) {
    return res.status(404).send("Usuario no encontrado");
  }
  //Opción de eliminar físicamente usuario
  usuario.destroy();
  //Opción de eliminar lógicamente usuario - falta

  res.status(200).send(`Usuario ${id} eliminado`);
};

//Login
let iniciarSesion = async (req, res, next) => {
  if (!req.body.email) {
    return res.status(422).json({
      error: {
        msg: "El campo de correo no puede estar vacío",
      },
    });
  }
  if (!req.body.password) {
    return res.status(422).json({
      error: {
        msg: "El campo de contraseña no puede estar vacío",
      },
    });
  }
  const { email, password } = req.body;
  try {
    //Verifica usuario
    const afiliado = await Afiliado.findOne({ where: { email } });
    if (!afiliado) {
      return res.status(400).json({
        error: {
          msg: "Usuario o contraseña incorrectos",
        },
      });
    }
    //Verifica clave
    const claveValida = bcrypt.compareSync(
      password,
      afiliado.dataValues.password
    );

    if (!claveValida) {
      return res.status(400).json({
        error: {
          msg: "Usuario o clave incorrectos",
        },
      });
    }
    //Genera token
    const token = await generarJWT(afiliado.dataValues.email);

    res.json({
      "usuario validado": afiliado,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: {
        msg:
          "Error del sistema, intente de nuevo más tarde o comuníquese con un asesor",
      },
    });
  }
};

module.exports = {
  obtenerAfiliados,
  obtenerAfiliado,
  crearAfiliado,
  modificarAfiliado,
  iniciarSesion,
};
