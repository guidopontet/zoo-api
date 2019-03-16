'use strict'

var express=require('express')
var AnimalController=require('../controllers/animal')

var api=express.Router();

// Para proteger las rutas por autenticación
var md_auth=require('../middlewares/authentication')
var md_admin=require('../middlewares/isAdmin')

// Middleware para subir archivos
var md_upload=require('../middlewares/images')

api.get('/pruebas-animales',md_auth.ensureAuth,AnimalController.pruebas);
api.post('/animal',[md_auth.ensureAuth,md_admin.isAdmin],AnimalController.saveAnimal);
api.get('/animals',AnimalController.getAnimals);
api.get('/animal/:id',AnimalController.getAnimal);
api.put('/animal/:id',[md_auth.ensureAuth,md_admin.isAdmin],AnimalController.updateAnimal);
api.post('/upload-image-animal/:id',[md_auth.ensureAuth,md_admin.isAdmin,md_upload.md_upload_animal],AnimalController.uploadImage);
api.get('/get-image-animal/:imageFile',AnimalController.getImageFile);
api.delete('/animal/:id',[md_auth.ensureAuth,md_admin.isAdmin],AnimalController.deleteAnimal);

module.exports=api