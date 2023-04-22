import mongoose, {Schema} from 'mongoose';

const schemaPublicacao = new Schema({
    idUsuario : {type: String, required : true},
    descricao : {type: String, required : true},
    imagem : {type: String, required : true},
    data : {type : Date, required : true},
    like : {type: Array, required : true ,default : []},
    comentario : {type: Array, required : true, default : []}
});

export const modeloPublicacao = (mongoose.models.publicacoes ||
    mongoose.model('publicacoes',schemaPublicacao));