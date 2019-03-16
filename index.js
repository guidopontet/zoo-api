'use_strict'

var mongoose=require('mongoose');
var app=require('./app')
var port=process.env.PORT || 3003



mongoose.connect('mongodb://localhost:27017/zoo',(err,res)=>{
	if(err){
		throw err;
	}else{
		console.log("Base de Datos ZOO conectada exitosamente")
		app.listen(port,()=>{
			console.log("Servidor corriendo exitosamente en el puerto: "+port)
		})
	}
})