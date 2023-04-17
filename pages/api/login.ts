import type {NextApiRequest, NextApiResponse} from 'next';
import conectar_bd from '@/middlewares/conectar-bd';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';

const login = (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    try{
        if(req.method == 'POST'){
            const {login, senha} = req.body;
            if(
                login == 'admin@admin.com' &&
                senha == 'senha123'
            ){
                return res.status(200).json({msg: 'Usuario logado com sucesso'});
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