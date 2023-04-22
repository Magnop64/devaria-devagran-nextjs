import { NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validar_jwt = (handler: NextApiHandler) => 
    (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>)=> {
        try{
            const {KEY_JWT} = process.env;
            if(!KEY_JWT){
                return res.status(401).json({erro: 'Dados de usuario incoerentes..'});
            }

            if(!req || !req.headers){
                return res.status(401).json({erro: 'Dados de usuario incoerentes..'});
            }

            if(req.method !== 'OPTIONS'){
                const authorization = req.headers['authorization'];
                if(!authorization){
                    return res.status(401).json({erro: 'Dados de usuario incoerentes..'});
                }

                const token = authorization.substring(7);
                if(!token){
                    return res.status(401).json({erro: 'Dados de usuario incoerentes..'});
                }

                const jwt_decod = jwt.verify(token,KEY_JWT) as JwtPayload;
                if(!jwt_decod){
                    return res.status(401).json({erro: 'Dados de usuario incoerentes..'});
                }

                if(!req || !req.query){
                    req.query = {}
                }
                req.query.userId = jwt_decod._id;
            }
            return handler(req, res);
        }catch(e){
            return res.status(500).json({erro: 'Não foi possivel completar a operação..'});
        }
    }