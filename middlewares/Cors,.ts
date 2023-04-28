import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import NextCors from 'nextjs-cors';

export const Cors = (handler : NextApiHandler) => async (req: NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
    try{

        await NextCors(req,res,{
            oring : '*',
            method : ['GET' , 'PUT', 'POST'],
            optionsSucessStatus : 200
        });

        return handler(req, res);

    }catch(e){
        console.log(e);
        return res.status(500).json({erro:'Não foi possivel validar o Cors.'})
    }
}