const {Router} = require('express')
const mainController = require('../controller/mainController')
const passport = require('passport')

const clientRouter = Router()

clientRouter.post('/sign-up', (req, res) => {
    mainController.createUser(res, req)
})
clientRouter.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });
  
      req.logIn(user, (err) => {
        if (err) return next(err);
       // res.json({ success: true, redirect: `/${user.id}`}); // Send JSON response
      });
    })(req, res, next);
  });
  clientRouter.get('/', (req,res) => {
  console.log(req.user)
  res.json({id: 'tets'})
})

module.exports = clientRouter