import type { NextApiRequest, NextApiResponse} from 'next';
import conectar_bd from '@/middlewares/conectar-bd';
import { validar_jwt } from '@/middlewares/validar_jwt';
import { modeloUsuario } from '@/models/modeloUsuario';

const buscar = async (req: NextApiRequest, res: NextApiResponse<any>) =>{
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuarioEncontrado = await modeloUsuario.findById(req?.query?.id);
                if(!usuarioEncontrado){
                    return res.status(400).json({erro:'Usuario nao encontrado..'});
                }
                usuarioEncontrado.senha = null;
                return res.status(200).json(usuarioEncontrado);
            }else{
                const {busca} = req.query;
                if(!busca || busca.length < 2){
                    return res.status(400).json({erro: 'parametros insuficientes para busca...'});
                }
                const usuariosEncontrados = await modeloUsuario.find({
                    nome : {$regex : busca, $options : 'i'}
                });
                if(usuariosEncontrados && usuariosEncontrados[0]){
                return res.status(200).json(usuariosEncontrados);
                }
                return res.status(401).json({erro: 'nenhum usuario encontrado.'});
            }

        }
        return res.status(405).json({erro: 'metodo informado nao e valido...'});

    }catch(e){
        console.log(e);
        return res.status(500).json({erro:'nao foi possivel completar sua busca..'});
    }
}

export default validar_jwt(conectar_bd(buscar));