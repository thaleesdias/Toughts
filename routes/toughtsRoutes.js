const { Router } = require('express')
const router = Router()
const ToughtController = require('../controllers/ToughtController')
  
// helpers
const checkAuth = require('../helpers/auth').checkAuth

//controller
router.get('/add',checkAuth, ToughtController.createToughts)
router.post('/add',checkAuth, ToughtController.createToughtsSave)
router.get('/edit/:id',checkAuth, ToughtController.updateTought)
router.post('/edit',checkAuth, ToughtController.updateToughtSave)
router.get('/dashboard',checkAuth, ToughtController.dashboard)
router.post('/remove',checkAuth, ToughtController.removeTought)
router.get('/', ToughtController.showToughts)

module.exports = router;