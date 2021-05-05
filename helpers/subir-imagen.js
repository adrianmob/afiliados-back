var cloudinary = require('cloudinary').v2;

let subirImagen = (public_id) => {
    let urlCloud = 'https://api.cloudinary.com/v1_1/rocafunnels-test/image/upload';
    let api_key = '126542855412889';
    // Obtener el timestamp en segundos
    var timestamp = Math.round((new Date).getTime()/1000);
    var signature = cloudinary.utils.api_sign_request({
        timestamp,
        public_id
    }, process.env.API_SECRET);
    return {
        urlCloud,
        api_key,
        timestamp,
        signature
    };
}

module.exports = subirImagen;