import multer from 'multer';
import cosmicjs from 'cosmicjs';

const{
    AVATAR,
    KEYAVATAR,    
    PUBLICACOES,    
    KEYPUBLICACOES
} = process.env;

const Cosmic = cosmicjs();

const BucketAvatar = Cosmic.bucket({
    slug: AVATAR ,
    write_key: KEYAVATAR
});

const BucketPostagem = Cosmic.bucket({
    slug: PUBLICACOES ,
    write_key: KEYPUBLICACOES
});

const Salvar = multer.memoryStorage();
const upload = multer({storage : Salvar});

const uploadImagem = async(req : any) => {

    if(req?.file?.originalname){
        const objetoImagem = {
            originalname : req.file.originalname ,
            buffer : req.file.buffer
        }

        if(req?.url && req?.url?.includes('publicacoes')){
            return await BucketPostagem.addMedia({media: objetoImagem});
        }else{
            return await BucketAvatar.addMedia({media: objetoImagem});
        }
    }
}

export {upload , uploadImagem};