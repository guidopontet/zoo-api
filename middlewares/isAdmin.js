'use strict'

// PARA RESTRINGIR MODULOS PARA ADMINISTRADORES

exports.isAdmin=(req,res,next)=>{
	if(req.user.role!='ROLE_ADMIN'){
		return res.status(200).send({message:'No tienes acceso a este modulo'})
	}else{
		next();
	}
}