import type { NextApiResponse} from 'next';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import { upload, uploadImagem } from '@/services/uploadImagem';
import nc from 'next-connect';
import { validar_jwt } from '@/middlewares/validar_jwt';
import conectar_bd from '@/middlewares/conectar-bd';
import { modeloPublicacao } from '@/models/modeloPublicacao';
import { modeloUsuario } from '@/models/modeloUsuario';

const handler = nc()
    .use(upload.single('file'))
    .post(async(req: any, res: NextApiResponse<respostaPadraoMsg>) =>{
        try{

            const{userId} = req.query;
            
            const usuario = await modeloUsuario.findById(userId);

            if(!usuario){
                return res.status(400).json({erro:'dados incoerentes.'});
            }

            if(!req || !req.body){
                return res.status(400).json({erro: 'Nenhum parametro encontrado.'});
            }

            const {descricao} = req.body;

            if(!descricao){
                return res.status(400).json({erro: 'É necesssario uma descrição .'});
            }

            if(!req.file && !req.file.originalname){
                return res.status(400).json({erro: 'Nenhuma imagem encontrada.'});
            }

            const img = await uploadImagem(req);

            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                imagem : img.media.url,
                data : new Date()
            }

            await modeloPublicacao.create(publicacao);

            return res.status(200).json({msg:'publicação salva com sucesso...'});
        }catch(e){
            console.log(e);
            return res.status(400).json({erro: 'Não foi possivel finalizar sua publicação.'});
        }
    })

    export const config = {
        api: {
            bodyParser : false
        }
    }

    export default validar_jwt(conectar_bd(handler));