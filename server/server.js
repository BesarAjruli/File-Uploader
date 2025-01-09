const express = require('express')
const clientRouter = require('./routers/clientRouter') 
const path = require('node:path')
const cors = require('cors')
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const {Pool} = require('pg')
const cookieParser = require('cookie-parser');

const prisma = new PrismaClient()
const db = new Pool({
  connectionString: process.env.DB_URL
})

const app = express()
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());
app.use(cors({
origin: 'http://localhost:5173',
credentials:true
}))
app.use(cookieParser());
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool:db,
    tableName: 'users_session',
    createTableIfMissing: true
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', clientRouter)

passport.use(
  new LocalStrategy( async (username, password, done) => {
    const user = await prisma.user.findFirst({where: { username: username }})

    try{
      if(!user){
        return done(null, false, {message: 'Incorrect username'})
      }
      const match = await bcrypt.compare(password, user.password)
      if(!match){
        return done(null, false, {message: 'Incorrect password'})
      } 

      return done(null, user)
    }catch(err){
      done(err)
    }
  })
)

passport.serializeUser((user, done) => {
   done(null, user.id)
})

passport.deserializeUser( async (id, done) => {
  try{
    const user = await prisma.user.findFirst({ where: {id: id} })
    done(null, user)
  }catch(error){
    console.log(error)
    return done(error)
  }
})

//app.get('*', (req, res) => {
    //res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  //});

app.listen(5000, () => {
    console.log('Server listening on port 5000')
})