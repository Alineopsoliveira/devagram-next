import {NextApiRequest, NextApiResponse} from 'next';
import { RespostaPadraoMsg} from '@/types/RepostaPadraoMsg';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';

const PesquisaEndpoint = async (
    req : NextApiRequest , res : NextApiResponse<RespostaPadraoMsg | any[]> ) =>{
       try{
            if(req.method === 'GET'){
                if(req?.query?.id){
                    const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
                    if(!usuarioEncontrado){
                        return res.status(400).json({erro: 'Usuario não encontrado'})
                    }
                        usuarioEncontrado.senha = null;
                        return res.status(200).json(usuarioEncontrado);
                }else{
                    const {filtro} = req.query;

                    if(!filtro || filtro.length < 2 ){
                        return res.status(400).json({erro : 'Favor informar pelo menos 2 caracteres para busca '})
                    }
    
                    const usuariosEncontrados = await UsuarioModel.find({
                       $or: [ {nome : {$regex : filtro, $options : 'i'}},
                            {email : {$regex : filtro, $options : 'i'}}]
                    });
                    
                    usuariosEncontrados.senha = null;
                    return res.status(200).json(usuariosEncontrados);
                }

               
            }

       }catch(e){
        console.log(e);
            return res.status(500).json({erro : 'Não foi possível buscar usuários:' + e})
       } 
    }

    export default validarTokenJWT(conectarMongoDB(PesquisaEndpoint));