const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req = request, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico/usuario/hospital.'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo.'
        });
    }

    // Procesar la imágen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imágen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imágen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imágen.'
            });
        }

        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });

    });

}

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Imágen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}