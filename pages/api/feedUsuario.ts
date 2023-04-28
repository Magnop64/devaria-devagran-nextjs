import type { NextApiRequest, NextApiResponse} from 'next';
import { modeloUsuario } from '@/models/modeloUsuario';
import { modeloSeguindo } from '@/models/modeloSeguindo';
import { modeloPublicacao } from '@/models/modeloPublicacao';
import { validar_jwt } from '@/middlewares/validar_jwt';
import conectar_bd from '@/middlewares/conectar-bd';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import { Cors } from '@/middlewares/Cors,';


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
            }else{
                //feed home
                //aqui busco o usuario logado
                const {userId} = req.query;
                const usuario = await modeloUsuario.findById(userId);
                if(!usuario){
                    return res.status(400).json({erro: 'Nao foi possivel carregar o feed do usuario'});
                }
                //aqui buso a lista de usuarios, que este usuario logado segue
                const usuariosSeguidos = await modeloSeguindo.find({usuarioId : usuario._id});
                //aqu8i transformo esta lista em uma lista unica de ids
                const usuariosSeguidosIds = usuariosSeguidos.map(seguidor => seguidor.usuarioSeguido);
                //aqui busco pelas publicacoes dos usuarios ids da lista
                const publicacoes = await modeloPublicacao.find({
                    $or : [
                        {idUsuario : usuario._id},
                        {idUsuario : usuariosSeguidosIds}
                    ]
                })
                //aqui ordeno por data da mais recente para mais antiga
                .sort({data : -1});

                return res.status(200).json(publicacoes)

            }
            
        }
        return res.status(400).json({erro: 'status erro feed...'});
    }catch(e){
        console.log(e); 
    }
    
}

export default Cors(validar_jwt(conectar_bd(feedUsuario)));