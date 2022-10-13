const { response, request } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req = request, res = response) => {

    const hospitales = await Hospital.find()
    .populate('usuario', 'nombre img');



    res.status(400).json({
        ok: true,
        hospitales
    });
}

const crearHospital = async (req = request, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.status(400).json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }

}

const actualizarHospital = async (req = request, res = response) => {



    res.status(400).json({
        ok: true,
        msg: 'actualizarHospital'
    });
}

const borrarHospital = async (req = request, res = response) => {



    res.status(400).json({
        ok: true,
        msg: 'borrarHospital'
    });
}


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}