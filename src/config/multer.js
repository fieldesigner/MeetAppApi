import multer from 'multer'; // responsavel pelo upload
import crypto from 'crypto'; // usado para gerar nome unico no arquivo
import {extname, resolve} from 'path';

export default{
  // configurando para salvar no proprio servidor
  storage: multer.diskStorage({
    // setando destino
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      //gerando novo nome para img com o crypto
      crypto.randomBytes(16, (err, res) =>{
        if(err) return cb(err);
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),  
};