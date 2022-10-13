const { response, request } = require('express');

const Medico = require('../models/medico');

const getMedicos = async (req = request, res = response) => {

    const medicos = await Medico.find()
    .populate('usuario', 'nombre img')
    .populate('hospital', 'nombre');

    res.status(400).json({
        ok: true,
        medicos
    });
}

const crearMedico = async (req = request, res = response) => {

    const uid = req.uid;

    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        
        const medicoDB = await medico.save();

        res.status(400).json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }

}

const actualizarMedico = async (req = request, res = response) => {



    res.status(400).json({
        ok: true,
        msg: 'actualizarHospital'
    });
}

const borrarMedico = async (req = request, res = response) => {



    res.status(400).json({
        ok: true,
        msg: 'borrarHospital'
    });
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}