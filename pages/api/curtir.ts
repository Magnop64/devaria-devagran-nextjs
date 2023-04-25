import type { NextApiRequest, NextApiResponse} from 'next';
import { validar_jwt } from '@/middlewares/validar_jwt';
import conectar_bd from '@/middlewares/conectar-bd';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import { modeloPublicacao } from '@/models/modeloPublicacao';
import { modeloUsuario } from '@/models/modeloUsuario';

const curtirEndPoint = async (req: NextApiRequest, res: NextApiResponse) => {
    try{
        if(req.method === 'PUT'){
            const {id} = req?.query;
            const publicacao = await modeloPublicacao.findById(id);
            if(!publicacao){
                return res.status(400).json({erro:'Publicação não encontrada..'});
            }
            const {userId}= req?.query;
            const usuario = await modeloUsuario.findById(userId);
            if(!usuario){
                return res.status(400).json({erro:'usuario deslogado'});
            }
            const usuarioCurtiu = await publicacao.like.findIndex((e : any) => e.toString === usuario._id.toString);
            if(usuarioCurtiu != -1){
                publicacao.like.splice(usuarioCurtiu, 1);
                await modeloPublicacao.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg:'Publicação descurtida com sucesso..'});
            }else{
                publicacao.like.push(usuario._id);
                await modeloPublicacao.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg:'publicação curtida com sucesso..'});
            }
        }
        return res.status(400).json({erro:'Metodo informado nao e valido..'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro: 'Publicação não encontrada..'});
    }
}

export default validar_jwt(conectar_bd(curtirEndPoint));