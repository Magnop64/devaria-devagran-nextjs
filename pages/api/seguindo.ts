import type { NextApiRequest, NextApiResponse} from 'next';
import { validar_jwt } from '@/middlewares/validar_jwt';
import conectar_bd from '@/middlewares/conectar-bd';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import { modeloUsuario } from '@/models/modeloUsuario';
import { modeloSeguindo } from '@/models/modeloSeguindo';

const seguindoEndPoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){
            const{userId} = req?.query;
            const usuarioLogado = await modeloUsuario.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro:'usuario nao esta logado..'});
            }
            const {id} = req?.query;
            const usuarioASeguir = await modeloUsuario.findById(id);
            if(!usuarioASeguir){
                return res.status(400).json({erro:'Usuario nao encontrado..'});
            }

            const usuarioJaSeguido = await modeloSeguindo.find({usuarioId : usuarioLogado._id, usuarioSeguido : usuarioASeguir._id});

            if(usuarioJaSeguido && usuarioJaSeguido.length > 0){
                usuarioJaSeguido.map(async(e) => modeloSeguindo.findByIdAndDelete({_id : e._id}));

                usuarioLogado.seguindo--;
                await modeloUsuario.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                usuarioASeguir.seguidores--;
                await modeloUsuario.findByIdAndUpdate({_id : usuarioASeguir._id}, usuarioASeguir);

                return res.status(200).json({msg : 'usuario deixado de ser seguido com sucesso..'});
            }else{
                const seguindoUsuario = {
                    usuarioId : usuarioLogado._id,
                    usuarioSeguido : usuarioASeguir._id
                }
                await modeloSeguindo.create(seguindoUsuario);
                console.log('seguindo',seguindoUsuario)

                usuarioLogado.seguindo++;
                await modeloUsuario.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                usuarioASeguir.seguidores++;
                await modeloUsuario.findByIdAndUpdate({_id : usuarioASeguir._id}, usuarioASeguir);

                return res.status(200).json({msg : 'usuario seguido com sucesso..'});
            }
        }
        return res.status(405).json({erro:'metodo informado nao e valido..'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro: 'usuario nao encontrado'});
    }
}

export default validar_jwt(conectar_bd(seguindoEndPoint));