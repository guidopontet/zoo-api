'use strict'

// LIBRERIAS
var bcrypt=require('bcrypt-nodejs')
var fs=require("fs")
var path=require("path")

// MODELOS
var User=require('../models/user')

// IMPORTAMOS SERVICIO JWT
var jwt=require('../services/jwt')

// ACCIONES

	// PRUEBA
function pruebas(req,res){
	res.status(200).send({
		message: 'Probando el controlador User',
		user: req.user
	})
}

	// REGISTRAR USUARIOS
function saveUser(req,res){
	var user=new User()

	// Parametros
	var params=req.body;

	// Si llegan los datos correctamente
	if(params.password && params.name && params.surname && params.email){
		
		// Asignamos valores al nuevo usuario
		user.name=params.name
		user.surname=params.surname
		user.email=params.email
		user.role='ROLE_USER'
		user.image=null

		// Controlamos que no exista otro usuario con el mismo email
		User.findOne({email:user.email.toLowerCase()},(err,existeUser)=>{
			if(err){
				res.status(500).send({message: 'Error al comprobar el usuario: '+err})
			}else{

				// Si no existe un usuario con ese pasword
				if(!existeUser){
					// Ciframos el password
					bcrypt.hash(params.password,null,null,(err,hash)=>{
						user.password=hash;

						// Guardamos el usuario en la base
						user.save((err,userStored)=>{
							if(err){
								res.status(500).send({message: 'Error al registrar usuario: '+err})
							}else{
								if(!userStored){
									res.status(404).send({message: 'Error al registrar usuario: '+err})
								}else{
									res.status(200).send({user: userStored})
								}
							}
						})
					})
				}else{
					res.status(200).send({message: 'Ya existe un usuario con ese email'})
				}
			}
		})

		
	}else{
		res.status(200).send({
			message: 'Introduce todos los datos para poder registrar al usuario'
		})
	}
}

	// LOGUEAR USUARIO
function login(req,res){

	var params=req.body;
	var email=params.email;
	var password=params.password;

	User.findOne({email: email.toLowerCase()},(err,user)=>{
		if(err){
			res.status(500).send({message: 'Error al comprobar el usuario: '+err})
		}else{
			// SI EXISTE EL USUARIO
			if(user){

				// Comprobamos la contraseña
				bcrypt.compare(password,user.password,(err,check)=>{
					if(check){
						// Devolvemos el usuario o el token, dependiendo
						if(params.getToken){
							// Devolvemos el token
							res.status(200).send({
								token: jwt.createToken(user)})
						}else{
							// Antes de enviar el user, seteamos el password para que no se envíe en plano (Aunque está codificada bcrypt)
							user.password=undefined
							res.status(200).send({user})
						}
						
					}else{
						res.status(404).send({message: 'Error de Autenticación'})
					}
				})

				
			}else{
				res.status(404).send({message: 'No existe el usuario'})
			}
		}
	})
}

	// EDITAR USUARIO
function updateUser(req,res){

	var userId=req.params.id;
	var update=req.body

	// Si el usuario a actualizar es el que está loguado
	if(userId!=req.user.sub){
		return res.status(500).send({message: 'No tienes permiso para editar ese usuario'})
	}

	// Actualizamos los campos || {new: true} para que devuelva el objeto actualizado
	User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
		if(err){
			res.status(500).send({message: 'Error al actualizar los campos'})
		}else{
			if(!userUpdated){
				res.status(500).send({message: 'Error al actualizar los campos'})
			}else{
				res.status(200).send({user:userUpdated})
			}
		}
	})
}

	// SUBIR IMAGEN AVATAR
function uploadImage(req,res){
	var userId=req.params.id
	var file_name='No subido...'
	
	// En la request, viene un files, gracias al middleware multiparty!
	if(req.files.image){

		var file_path=req.files.image.path
		var file_split=file_path.split('\\')
		var file_name=file_split[2]
		var ext_split=file_name.split('.')
		var file_ext=ext_split[1]

		// Comprobamos la extensión del archivo
		if(file_ext=='png'||file_ext=='jpg'||file_ext=='jpeg'||file_ext=='gif'){
			
			// Actualizamos el usuario

			// Si el usuario a actualizar es el que está loguado
			if(userId!=req.user.sub){
				return res.status(500).send({message: 'No tienes permiso para editar este usuario'})
			}

			// Actualizamos los campos || {new: true} para que devuelva el objeto actualizado
			User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated)=>{
				if(err){
					res.status(500).send({message: 'Error al actualizar la imagen'})
				}else{
					if(!userUpdated){
						res.status(500).send({message: 'Error al actualizar la imagen'})
					}else{
						res.status(200).send({user:userUpdated})
					}
				}
			})

		}else{
			// Extensión no válida, por lo tanto
			// Tenemos que borrar la imagen, dado que ya estaría subida igualmente
			fs.unlink(file_path,(err)=>{
				if(err){
					// console.log(err)
					res.status(200).send({message: 'Extensión no válida y fichero no borrado'})
				}else{
					res.status(200).send({message: 'Extensión no válida'})
				}
			})
		}

	}else{
		res.status(200).send({message: 'No se ha subido el archivo'})
	}
}

	// DEVOLVER UNA IMAGEN
function getImageFile(req,res){
	var imageFile=req.params.imageFile
	var path_file='uploads/users/'+imageFile

	// Si existe la imagen
	fs.exists(path_file,(exists)=>{
		if(exists){
			// Utilizamos la librería path, ya que necesitamos la ruta absoluta
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({message: 'La imagen no existe'})
		}
	})
}

	// METODO PARA LISTAR CUIDADORES
function getKeepers(req,res){
	User.find({role: 'ROLE_ADMIN'}).exec((err,users)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'})
		}else{
			// Si no existen cuidadores
			if(users.length<=0){
				res.status(404).send({message: 'No existen cuidadores'})
			}else{
				res.status(200).send({users})
			}
		}
	})
}

module.exports={
	pruebas,
	saveUser,
	login,
	updateUser,
	uploadImage,
	getImageFile,
	getKeepers
}