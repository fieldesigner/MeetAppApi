import * as Yup from 'yup'; // usando para validar as informações do form
import User from '../models/User';

class UserController {
  /* CADASTRO DE USUÁRIO */
  async store(req, res) {
    // validando as informações do form
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'erro de validação' });
    }

    // antes de cadastrar verificar se o email informado existe
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'usuário já existe' });
    }

    const { id, name, email } = await User.create(req.body);
    return res.json({ id, name, email });
  }

  async update(req, res) {
    // console.log(req.userId); //variavel puxada do token no header

    // validando as informações do form
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          // (oldPassword ?) : se oldPassword nao for nulo ou false ou undefined
          // (field.required()) : então o field (referente ao password) será obrigatório
          // (: field) se não retorna o field password sem ser obrigatório
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        // (password ?) : se o password estiver preenchido
        // (field.required()) : entao confirmPassword será obrigatório
        // (.oneOf([Yup.ref('password')])) e ele precisa ser igual ao campo password
        // (: field) se não retorna o field confirmPassword sem ser obrigatório
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'erro de validação' });
    }

    // pegando informações enviadas pelo user atravez do formulario
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId); // id do user logado

    // verificando se o email que ele esta enviando já existe nos cadastros
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'usuário já existe' });
      }
    }

    // verificando old password caso esteja alterando a senha
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'password atual incorreto' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({ id, name, email });
  }
}

export default new UserController();
