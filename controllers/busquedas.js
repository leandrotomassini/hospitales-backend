const { response, request } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


const getTodo = async (req = request, res = response) => {
    try {
        const busqueda = req.params.busqueda;
        const regex = new RegExp(busqueda, 'i');

        const [usuarios, medicos, hospitales] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Medico.find({ nombre: regex }),
            Hospital.find({ nombre: regex })
        ]);

        res.status(400).json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
}

const getDocumentosColeccion = async (req = request, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img');
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                .populate('usuario', 'nombre img');
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;
        default:
            return res.status(500).json({
                ok: false,
                msg: 'La tabla debe de ser usuarios/medicos/hospitales.'
            });
    }

    res.status(400).json({
        ok: true,
        tabla,
        resultados: data,
    });

}

module.exports = {
    getTodo,
    getDocumentosColeccion
}