const Tought = require("../models/Toughts");
const User = require("../models/User");

const {Op} = require('sequelize')

module.exports = class ToughtController {
  static async showToughts(req, res) {

    let search = '';

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC"

    if (req.query.order === 'old') {
      order = "ASC"
    } else {
      order = "DESC"
    }

    const toughtData = await Tought.findAll({
      include: User,
      where: {
        title: {[Op.like]: `%${search}%`}
      },
      order: [['createdAt', order]]
    })


    const toughts = toughtData.map((result) => result.get({ plain: true }))
    
    let toughtsQty = toughts.length
      
    res.render("toughts/home", { toughts, search, toughtsQty})
    
  }

  static async dashboard(req, res) {
    const userId = req.session.userid
    const user = await User.findOne({
      where: {
        id: userId
      },
      include: Tought,
      plain: true

    })
    //check if user exists
    if (!user) {
      res.redirect('/login')
    }

    const toughts = user.Toughts.map((result) => result.dataValues)



    let emptyToughts = toughts.length === 0 ? true : false


    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  static createToughts(req, res) {
    res.render("toughts/create");
  }

  static async createToughtsSave(req, res) {
    const toughts = {
      title: req.body.title,
      UserId: req.session.userid,
    };


    try {
      await Tought.create(toughts);

      req.flash("message", "Pensamento criado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });

    } catch (error) {
      console.log(error);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id
    const UserId = req.session.userid

    try {

      await Tought.destroy({ where: { id: id, UserId: UserId } })
      req.flash("message", "Pensamento removido com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });

    } catch (error) {
      console.log('eu   ', error)
    }
  }

  static async updateTought(req, res) {

    const id = req.params.id

    const tought = await Tought.findOne({ where: { id: id }, raw: true })


    res.render('toughts/edit', { tought })
  }

  static async updateToughtSave(req, res) {
    const id = req.body.id
    const tought = {
      title: req.body.title,

    }

    
    
    await Tought.update(tought, { where: { id: id } }).then(() => {
        
      req.flash("message", "Pensamento Atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      })
    }
    ).catch(err => console.log(err))
  


  }
}