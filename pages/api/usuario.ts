import { NextApiRequest, NextApiResponse} from 'next';
import { validar_jwt } from '@/middlewares/validar_jwt';
import { modeloUsuario } from '@/models/modeloUsuario';
import conectar_bd from '@/middlewares/conectar-bd';
import { Cors } from '@/middlewares/Cors,';


const usuario = async(req: NextApiRequest, res: NextApiResponse)=>{

    try{
        const{userId} = req?.query;

        const usuario = await modeloUsuario.findById(userId);

        usuario.senha = null;

        return res.status(200).json(usuario);

    }catch(e){
        console.log(e);
        return res.status(400).json({erro: 'Não foi possivel se conectar com este usuario.'})
    }
}

export default Cors(validar_jwt(conectar_bd(usuario)));