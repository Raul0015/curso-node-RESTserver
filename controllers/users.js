// Functions to contoll
const { response, request } = require('express');

const getUsers = (req = request, res = response) => {

    const {q, nombre, apikey} = req.query;

    res.json({
        ok: true,
        msg: 'GET API from Controller',
        q,
        nombre,
        apikey
    })
};

const putUser = (req, res = response) => {

    const { id }= req.params;

    res.json({
        ok: true,
        msg: 'PUT API from Controller',
        id
    });
};

const postUser = (req, res = response) => {
    
    // const body = req.body;
    // Podemos desestructurar
    const {nombre, edad} = req.body;
    
    res.json({
        ok:true,
        msg: 'POST API fron Controller',
        //body
        nombre,
        edad
    });
};

const deleteUser = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'DELETE API from Controller'
    });
};

const patchUser = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'PATCH API from Controller'
    });
};


module.exports = {
    getUsers,
    putUser,
    postUser,
    deleteUser,
    patchUser
}