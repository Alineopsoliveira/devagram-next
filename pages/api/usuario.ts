import type { NextApiRequest, NextApiResponse } from "next";
import { ValidarTokenJWT } from '../../middlewares/validarTokenJWT'


const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse) => {

    return res.status(200).json('Usuario autenticado com sucess');
}

export default  ValidarTokenJWT(usuarioEndpoint);