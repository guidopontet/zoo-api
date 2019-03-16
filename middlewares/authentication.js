'use strict'

// COMPRUEBA SI EL USUARIO ESTÁ AUTENTICADO
var jwt=require('jwt-simple')
var moment=require('moment')
var secret='claveSecretaDelCursoDeAngularAvanzado'

exports.ensureAuth=function(req,res,next){
	if(!req.headers.authorization){
		return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'})
	}

	// Guardamos el token y si viene con comillas simples o dobles las reemplazamos por nada
	var token=req.headers.authorization.replace(/['"']+/g,'');

	try{
		// Decodificamos el token, si es válido no va a saltar la excepcion
		var payload=jwt.decode(token,secret);

		// Verificamos la validez según el tiempo
		if(payload.exp<=moment().unix()){
			return res.status(401).send({
				message: 'El token ha expirado'
			})
		}
	}catch(ex){
		return res.status(404).send({message: 'El token no es válido'})
	}

	// Creamos una nueva propiedad en REQ para poder acceder al user en cualquier parte
	req.user=payload;
	next();
}