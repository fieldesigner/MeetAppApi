import Files from '../models/Files';

class FileController {
  async store(req, res) {
    // pegando path do arquivo
    const { originalname: name, filename: path } = req.file;
    // cadastrando na tabela
    const file = await Files.create({
      name,
      path,
    });
    return res.json(file);
  }
}
export default new FileController();
