const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req = request, res = response) => {

    const desde = Number(req.query.desde) || 0;


    const [usuarios, total] = await Promise.all([
       await Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),

        await Usuario.countDocuments()
    ])

    res.status(400).json({
        ok: true,
        usuarios,
        total
    });
};

const crearUsuario = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar el usuario
        await usuario.save();

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs.'
        });
    }
};


const actualizarUsuario = async (req = request, res = response) => {

    // TODO: Validar token y comprobar si es un usuario correcto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usaurio por ese ID.'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email.'
                });
            }
        }

        campos.email = email;
        const usaurioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usaurioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }
};

const borrarUsuario = async (req = request, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usaurio por ese ID.'
            });
        }

        await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            uid
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }



}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}