import type {NextApiRequest, NextApiResponse} from 'next';
import conectar_bd from '@/middlewares/conectar-bd';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import { modeloUsuario } from '@/models/modeloUsuario';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { Cors } from '@/middlewares/Cors,';

const login = async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) => {
    try{
        const {KEY_JWT} = process.env;
        if(!KEY_JWT){
            return res.status(500).json({erro: 'Chave de acesso jwt nao informado'});
        }

        if(req.method == 'POST'){
            const {email, senha} = req.body;
            
            const usuarioLogar = await modeloUsuario.find({email: email, senha: md5(senha)});

            if(usuarioLogar && usuarioLogar.length > 0){
                const usuarioLogado = usuarioLogar[0];
                
                const token = jwt.sign({_id: usuarioLogado._id}, KEY_JWT);

                return res.status(200).json({
                    nome: usuarioLogado.nome,
                    email: usuarioLogado.email,
                    token
                });
            }
            return res.status(401).json({msg: 'Usuario ou senha informados não é valido...'});
        }
        return res.status(400).json({erro: 'Algo deu errado...'});
    }catch(e){
        console.log(e)
        return res.status(500).json({erro: 'ops algo deu errado!'});
    }
}

export default Cors(conectar_bd(login));