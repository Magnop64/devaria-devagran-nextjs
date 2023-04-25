import mongoose, {Schema} from 'mongoose';

const seguindoSchema = new Schema({
    usuarioId : {type: String, required: true},
    usuarioSeguido : {type: String, required: true}
});

export const modeloSeguindo =(mongoose.models.seguidores ||
    mongoose.model('seguidores', seguindoSchema));