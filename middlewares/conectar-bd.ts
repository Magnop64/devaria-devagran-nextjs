import type { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';

const conectar_bd = (handler: NextApiHandler) =>
    async(req: NextApiRequest, res: NextApiResponse)=>{
        // verifico se esta conectado e se estiver sigo em frente
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }

        //se nao estiver conectado então conectar

        const {STRING_BD} = process.env;

        // se estiver algo de erado na string de conexao , verifico
        if(!STRING_BD){
            return res.status(500).json({erro: 'string de conexao icompleta ou ausente.'})
        }

        // se estiver tudo ok conecto
        mongoose.connection.on('connected',() => console.log('Banco de dados conectado com sucesso'));
        mongoose.connection.on('erro', (e)=> console.log(e));
        await mongoose.connect(STRING_BD);

        return handler(req, res);
    }

export default conectar_bd;