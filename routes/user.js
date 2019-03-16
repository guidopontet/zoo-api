'use strict'

var express=require('express')
var UserController=require('../controllers/user')

var api=express.Router();

// Para proteger las rutas por autenticación
var md_auth=require('../middlewares/authentication')

// Middleware para subir archivos
var md_upload=require('../middlewares/images')

api.get('/pruebas-del-controlador',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.login);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/uploadImageUser/:id',[md_auth.ensureAuth,md_upload.md_upload_user],UserController.uploadImage);
api.get('/get-image-file/:imageFile',UserController.getImageFile);
api.get('/keepers',UserController.getKeepers);

module.exports=api