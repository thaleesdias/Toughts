const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body
    
    //find user
    const user = await User.findOne({ where: { email: email } })
   
    
    if (!user) {
      req.flash("message", "Usuário não cadastrado");
      res.render("auth/login");
      return  
    }
    
    // check if password match
    const passwordMatch = bcrypt.compareSync(password, user.password)

    if (!passwordMatch) {
      req.flash("message", "Senha inválida");
      res.render("auth/login");
      return
    }
    
    // initialize session
    req.session.userid = user.id

    req.flash("message", "login realizado!");

    req.session.save(() => {
      res.redirect("/");
      
    })
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (password != confirmpassword) {
      req.flash("message", "As senhas não conferem, try again!");
      res.render("auth/register");

      return;
    }

    // check if user exist

    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      req.flash("message", "E-mail já cadastrado");
      res.render("auth/register");

      return;
    }

    // create password

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };
    try {
      const createdUser = await User.create(user);

      // iniciar sessão

      req.session.userid = createdUser.id

      req.flash("message", "Usuário cadastrado!");

      req.session.save(() => {
        res.redirect("/");
        
      })

    } catch (err) {
      console.log(err);
    }
  }

  static logout(req, res) {
    req.session.destroy()
    res.redirect('/login')
  }

  
};
