const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
}); //connet backend to cloudinary account

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedformats: ["png", "jpeg", "jpg"],
    },
}); //defining storage location in cloudinary

module.exports = {
    cloudinary,
    storage,
}; // then export this and also use it on (routes --> listing.js file)