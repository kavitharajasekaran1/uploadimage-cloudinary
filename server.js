
require('dotenv').config()

const express = require('express');
const app = express();
const multer = require('multer');
const cloudinary = require('cloudinary')

const PORT = process.env.PORT || 5000

cloudinary.config({ 
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.APIKEY, 
    api_secret: process.env.APISECRET 
  });

  const storage = new multer.memoryStorage();
  const upload = multer({
    storage
  })

  async function handleUpload (file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type : "auto"
    })
    return res;
  }

  app.post('/upload', upload.single("myFile"), async(req,res)=>{
    try{
        const base_64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + base_64;
        const cldRes = await handleUpload(dataURI);
        res.json(cldRes);
    }
    catch(error) {
        console.log(error);
        res.send({
            message: error.message
        })
    }
  })


  app.listen(PORT, ()=>{console.log(`server is running on ${PORT}`)})