'use strict'

var jwt=require("jwt-simple")
var moment=require("moment")
var secret='claveSecretaDelCursoDeAngularAvanzado'

exports.createToken=function(user){
	var payload={
		sub:user._id,
		name:user.name,
		surname:user.surname,
		email:user.email,
		role:user.role,
		image:user.image,
		// Fecha de creación
		iat: moment().unix(),
		// Fecha de expiración
		exp:moment().add(30,'day').unix()
	}

	// Retornamos el token, que es el payload cifrado
	return jwt.encode(payload,secret)
}