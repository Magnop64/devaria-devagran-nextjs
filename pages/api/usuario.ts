import { NextApiRequest, NextApiResponse} from 'next';
import { validar_jwt } from '@/middlewares/validar_jwt';

const usuario = (req: NextApiRequest, res: NextApiResponse)=>{
    return res.status(200).json({msg: 'Usuario autenticado com sucesso..'})
}

export default validar_jwt(usuario);