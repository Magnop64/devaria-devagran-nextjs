import type {NextApiRequest, NextApiResponse} from 'next';
import conectar_bd from '@/middlewares/conectar-bd';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import { modeloUsuario } from '@/models/modeloUsuario';
import md5 from 'md5';

const login = async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    try{
        if(req.method == 'POST'){
            const {email, senha} = req.body;
            
            const usuarioLogar = await modeloUsuario.find({email: email, senha: md5(senha)});

            if(usuarioLogar && usuarioLogar.length > 0){
                const usuarioLogado = usuarioLogar[0];
                return res.status(200).json({msg: `Usuario ${usuarioLogado.nome} logado com sucesso`});
            }
            return res.status(401).json({msg: 'Usuario ou senha informados não é valido...'});
        }
        return res.status(400).json({erro: 'Algo deu errado...'});
    }catch(e){
        console.log(e)
        return res.status(500).json({erro: 'ops algo deu errado!'});
    }
}

export default conectar_bd(login);