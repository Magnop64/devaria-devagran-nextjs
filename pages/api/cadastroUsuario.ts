import type {NextApiRequest, NextApiResponse} from 'next';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import type { typeCadastro } from '@/types/typeCadastro';
import conectar_bd from '@/middlewares/conectar-bd';
import { modeloUsuario } from '@/models/modeloUsuario';
import md5 from 'md5';


const cadastroUsuario = async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>)=>{
    try{
        if(req.method === 'POST'){
            const usuario = req.body as typeCadastro;

            if(!usuario.nome || usuario.nome.length < 5){
                return res.status(400).json({erro: 'Não e possivel cadastrar este nome.'});
            }

            if(!usuario.email || usuario.email.length < 8 || !usuario.email.includes("@") || !usuario.email.includes(".")){
                return res.status(400).json({erro: 'Não é possivel cadastrar este email.'});
            }

            const emailJaExiste = await modeloUsuario.find({email: usuario.email});
                if(emailJaExiste && emailJaExiste.length > 0){
                    return res.status(400).json({erro:'Já existe uma conta com este email.'})
                }

            if(!usuario.senha || usuario.senha.length < 5){
                return res.status(400).json({erro: 'Não é possivel cadastrar esta senha.'});
            }

            const usuarioCadastrar = {
                nome : usuario.nome,
                email : usuario.email,
                senha : md5(usuario.senha)
            }

            await modeloUsuario.create(usuarioCadastrar);

            return res.status(200).json({msg: 'Usuario cadastrado com sucesso..'});
        }
        res.status(405).json({erro: 'Ops algo deu arrado...'});
    }catch(e){
        console.log(e)
        return res.status(500).json({erro: 'Ops não foi possivel completar seu cadastro.'});
    }
}

export default conectar_bd(cadastroUsuario);