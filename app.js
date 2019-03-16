// CONFIGURACION DE LA APLICACION A  NIVEL DE EXPRESS

'use strict'

var express=require('express')
var bodyParser=require('body-parser')

var app=express();

// MIDDLEWARES
var md_cors=require('./middlewares/cors')

// CARGAR RUTAS
var user_routes=require('./routes/user')
var animal_routes=require('./routes/animal')

// MIDDLEWARES DE BODYPARSER
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// CONFIGURAR CABECERAS Y CORS
	// Para permitir peticiones http entre dominios diferentes
app.use(md_cors.cors)

// RUTAS BASE
app.use('/api',user_routes)
app.use('/api',animal_routes)


module.exports=app
