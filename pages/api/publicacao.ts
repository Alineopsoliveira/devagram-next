import type { NextApiResponse } from "next"; 
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";  
import { conectarMongoDB } from "@/middlewares/conectarMongoDB"; 
import type { RespostaPadraoMsg } from "@/types/RepostaPadraoMsg";
import nc from "next-connect";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel"; 
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic"; 

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse<RespostaPadraoMsg>) => {

            try{
                const {userId} = req.query;
                const usuario = await UsuarioModel.findById(userId);
                if(!usuario){
                    return res.status(400).json({erro : "Usuário não encontrado"})
                }

                if(!req || !req.body){
                    return res.status(400).json({erro : "Paramêtros de entrada não informado"})
                }

                const{descricao} = req?.body;

                if(!descricao || descricao.length < 2){
                    return res.status(400).json({erro : "Descrição não é válida"})
                }
        
                if(!req.file || !req.file.originalname){
                    return res.status(400).json({erro : "Imagem é obrigátoria"})
                }
        
                const image = await uploadImagemCosmic(req);
                const publicacao = {
                    idUsuario : usuario._id,
                    descricao, 
                    foto : image.media.url,
                    data : new Date()
                }

                await PublicacaoModel.create(publicacao);

                return res.status(200).json({msg: 'Publicação criada com sucesso'})
            }catch(e){
                console.log(e);
                return res.status(400).json({erro : "Erro ao cadastrar publicação"})
            }

    });

    export const config = {
        api : {
            bodyParser : false
        }
    }

    export default  validarTokenJWT(conectarMongoDB(handler));