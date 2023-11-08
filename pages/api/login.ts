import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'; 
import type {RespostaPadraoMsg} from '../../types/RepostaPadraoMsg';

const endpointLogin = (
    req : NextApiRequest,
    res : NextApiResponse <RespostaPadraoMsg>
 ) => {
    if(req.method === 'POST'){
        const{login, senha} = req.body;
        
            if(login === 'adimin@adimin.com' && senha === 'Adimin@123'){
               return res.status(200).json({msg : 'Usuário autenticado com sucesso'})
            }
            return res.status(400).json({erro: 'Usuário e senha não encontrados'});
    } else if(req.method === 'GET'){
        return res.status(200).json({msg: 'Bem-vindo'})
    }
    return res.status(405).json({erro : 'Metodo informado não é válido'});
}

export default conectarMongoDB(endpointLogin);

