import type {NextApiRequest , NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose'
import {RespostaPadraoMsg} from '../types/RepostaPadraoMsg'


export const conectarMongoDB = (handler : NextApiHandler) => 
async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {

    // Verificar se o banco já está conectado, se tiver seguir para o endpoint ou proxímo widdleware  


    if(mongoose.connections[0].readyState){ // se o mongoose possui pelo menos uma conexão e pronta para uso
        //readyState verifica se o mongoose está pronto 
        return handler(req , res); //se estiver conec tdo segue para o endpoint
    }

    // ja que não está conectado vamos conectar
    //obter variavel de ambiente preenchida do env

    const {DB_CONEXAO_STRING} = process.env;

    // Se a env estiver vazia aborta o uso do sistema e avisa o programador

    if(!DB_CONEXAO_STRING){
        return res.status(500).json({ erro: 'ENV de configuração, não informado'})

    }
    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar no banco ${error}`));
   await mongoose.connect(DB_CONEXAO_STRING);

    // agora  posso seguir para o endpoint, pois estou conctado no banco
   return handler(req, res);
}