const {Router} = require('express')
const mainController = require('../controller/mainController')
const passport = require('passport')

const clientRouter = Router()

clientRouter.post('/sign-up', (req, res) => {
    mainController.createUser(res, req)
})
clientRouter.post("/login", passport.authenticate('local'), (req, res) => {
  res.json({success: true, redirect: `/${req.user.id}`});
  });
  clientRouter.get('/', (req,res) => {
  if(req.user) res.json({id: req.user.id})
})

module.exports = clientRouter