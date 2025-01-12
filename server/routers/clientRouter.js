const {Router} = require('express')
const mainController = require('../controller/mainController')
const passport = require('passport')
const { PrismaClient } = require("@prisma/client");
const cors = require('cors')

const prisma = new PrismaClient()

const clientRouter = Router()

clientRouter.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,   }))

clientRouter.post('/sign-up', (req, res) => {
    mainController.createUser(res, req)
})
clientRouter.post("/login", passport.authenticate('local'), (req, res) => {
  res.json({success: true, redirect: `/${req.user.id}`});
  });

clientRouter.get('/', async (req,res) => {
  const folders = await mainController.getFolders(req, res)
  if(req.user) res.json({id: req.user.id, folders: folders})
})

clientRouter.get('/folder/:id', async (req,res) => {
  const folderId = req.params.id
  const files = await mainController.getFiles(req, folderId)
  if(req.user) res.json({id: req.user.id, files: files})
})

//POST
clientRouter.post('/', (req, res) => {
  mainController.createFolder(req, res)
})
clientRouter.post('/folder', (req, res) => {
  mainController.createFile(req, res)
})

module.exports = clientRouter