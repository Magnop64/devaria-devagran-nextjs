import type { NextApiRequest, NextApiResponse} from 'next';
import { modeloUsuario } from '@/models/modeloUsuario';
import { modeloSeguindo } from '@/models/modeloSeguindo';
import { modeloPublicacao } from '@/models/modeloPublicacao';
import { validar_jwt } from '@/middlewares/validar_jwt';
import conectar_bd from '@/middlewares/conectar-bd';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import { Cors } from '@/middlewares/Cors,';


const comentariosEndPoint = async(req: NextApiRequest, res: NextApiResponse < respostaPadraoMsg | any>) => {
    try{
        if(req.method === 'PUT'){
             const{userId , id} = req.query;
             const usuario = await modeloUsuario.findById(userId);
             if(!usuario){
                return res.status(400).json({erro:'Não foi possivel carregar dados do usuario'});
            }

            const publicacao = await modeloPublicacao.findById(id);
            if(!publicacao){
                return res.status(400).json({erro:'Publicação não encomtrada.'});
            }
            
            const comentarioReq = req?.body?.comentario;
            if(!comentarioReq || comentarioReq.length < 2){
                return res.status(400).json({erro:'comentario invalido'});                
            }
            const comentarioSalvar = {
                idUsuario : usuario._id,
                nome : usuario.nome,
                comentarioReq
            }
 
            publicacao.comentario.push(comentarioSalvar)
            await modeloPublicacao.findByIdAndUpdate({_id : publicacao._id}, publicacao);

            return res.status(200).json({msg:'Comentario salvo com sucesso..'});
        }
        return res.status(400).json({erro: 'Metodo informado não e valido'});
    }catch(e){
        console.log(e); 
    }
    
}

export default Cors(validar_jwt(conectar_bd(comentariosEndPoint)));