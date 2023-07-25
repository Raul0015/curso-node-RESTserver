const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise ((resolve, reject) => {
        const { archivo } = files;
        // Ver la extension del archivo
        const nombreCortado = archivo.name.split('.');
        // Sacar la extensión del archivo
        const extension = nombreCortado[nombreCortado.length - 1]; // Ultima posicion - 1

        //Validar extension
        if(!extensionesValidas.includes(extension)){ //Si es falso
            return reject (`La ${extension} no es permitida - ${extensionesValidas}`);
        }

        // console.log(nombreCortado);
        // res.json({ extension });
    
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp);
    
        archivo.mv(uploadPath, (err) => {
            if (err) {
             reject (err)
            }
    
            resolve(nombreTemp);
        });
    });
    
}


module.exports = {
    subirArchivo
}