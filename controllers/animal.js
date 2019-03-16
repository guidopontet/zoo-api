'use strict'

// LIBRERIAS
var fs=require("fs")
var path=require("path")

// MODELOS
var Animal=require('../models/animal')
var User=require('../models/user')

// ACCIONES

	// PRUEBA
function pruebas(req,res){
	res.status(200).send({
		message: 'Probando el controlador Animal',
		user: req.user
	})
}

	// GUARDAR ANIMAL
function saveAnimal(req,res){
	
	// Parametros
	var params=req.body

	// Objeto Animal
	var animal=new Animal();	

	// Comprobamos datos obligatorios
	if(params.name){

		animal.name=params.name;
		animal.description=params.description;
		animal.year=params.year;
		animal.image=null;
		animal.user=req.user.sub;

		animal.save((err,animalStored)=>{
			if(err){
				res.status(500).send({message: 'Error en el servidor'})
			}else{
				if(!animalStored){
					res.status(404).send({message: 'No se ha guardado el animal'})
				}else{
					res.status(200).send({animal: animalStored})
				}
				
			}
		})
	}else{
		res.status(500).send({message: 'El nombre del animal es obligatorio'})
	}
}

	// LISTAR ANIMALES - populando con la informacion del usuario o cuidador
function getAnimals(req,res){
	Animal.find({}).populate('user').exec((err,animals)=>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'})
		}else{
			if(animals.length<=0){
				res.status(404).send({message: 'No existen animales'})
			}else{
				res.status(200).send({animals})
			}
		}
	})
}

	// DEVOLVER UN ANIMAL
function getAnimal(req,res){
	var animalId=req.params.id

	Animal.findById(animalId).populate('user').exec((err,animal)=>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'})
		}else{
			if(animal.length<=0){
				res.status(404).send({message: 'No existe el animal'})
			}else{
				res.status(200).send({animal})
			}
		}
	})
}

	// ACTUALIAR ANIMAL
function updateAnimal(req,res){
	// ID del animal a actualizar
	var animalId=req.params.id;

	// Datos a actualizar
	var update=req.body

	Animal.findByIdAndUpdate(animalId,update,{new:true},(err,animalUpdate)=>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'})
		}else{
			if(!animalUpdate){
				res.status(404).send({message: 'No se ha actualizado el animal'})
			}else{
				res.status(200).send({animalUpdate})
			}
		}
	})
}

	// SUBIR IMAGEN ANIMAL
function uploadImage(req,res){
	var animalId=req.params.id
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
			
			// Actualizamos el animal

			// Si el cuidador es el que quiere subir la imagen

			// Actualizamos los campos || {new: true} para que devuelva el objeto actualizado
			Animal.findByIdAndUpdate(animalId,{image:file_name},{new:true},(err,animalUpdated)=>{
				if(err){
					res.status(500).send({message: 'Error al actualizar la imagen del animal'})
				}else{
					if(!animalUpdated){
						res.status(500).send({message: 'Error al actualizar la imagen del animal'})
					}else{
						res.status(200).send({animal:animalUpdated})
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
	var path_file='uploads/animals/'+imageFile

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

	// BORRAR ANIMAL
function deleteAnimal(req,res){
	var animalId=req.params.id;

	Animal.findByIdAndRemove(animalId,(err,animalRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'})
		}else{
			if(!animalRemoved){
				res.status(404).send({message: 'No se ha podido eliminar el animal'})
			}else{
				res.status(200).send({animal: animalRemoved})
			}
		}
	})
}

module.exports={
	pruebas,
	saveAnimal,
	getAnimals,
	getAnimal,
	updateAnimal,
	uploadImage,
	getImageFile,
	deleteAnimal
}