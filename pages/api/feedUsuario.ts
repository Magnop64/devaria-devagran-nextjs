import type { NextApiRequest, NextApiResponse} from 'next';
import { modeloUsuario } from '@/models/modeloUsuario';
import { modeloPublicacao } from '@/models/modeloPublicacao';
import { validar_jwt } from '@/middlewares/validar_jwt';
import conectar_bd from '@/middlewares/conectar-bd';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import type { respostaFeed } from '@/types/r4espostaFeed';

const feedUsuario = async(req: NextApiRequest, res: NextApiResponse < respostaPadraoMsg | any>) => {

    try{
        if(req.method === 'GET'){

            if(req?.query?.id){
                const usuario = await modeloUsuario.findById(req.query.id);
                if(!usuario){
                    return res.status(400).json({erro: 'Nao foi possivel validar seu usuario...'});
                }

                const feed = await modeloPublicacao
                    .find({idUsuario : usuario._id})
                    .sort({data : -1});

                return res.status(200).json(feed);
            }
            
        }
        return res.status(400).json({erro: 'status erro feed...'});
    }catch(e){
        console.log(e); 
    }
    
}

export default validar_jwt(conectar_bd(feedUsuario));