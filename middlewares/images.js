// Middleware para subir archivos
var multipart=require("connect-multiparty")

var md_upload_user=multipart({uploadDir: 'uploads/users'})
var md_upload_animal=multipart({uploadDir: 'uploads/animals'})

module.exports={
	md_upload_user,
	md_upload_animal
}