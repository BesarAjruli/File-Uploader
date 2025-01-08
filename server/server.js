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

const prisma = new PrismaClient()
const pool = new Pool({
  connectionString: process.env.DB_URL
})

const app = express()
require("dotenv").config();

app.use(express.urlencoded({ extended: false }))
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true
};
app.use(cors(corsOptions));

app.use(
  session({
     store: new (require("connect-pg-simple")(session))({
      pool: pool,
      tableName: "users_session",
      createTableIfMissing: true,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  }),
);
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());
app.use('/api', clientRouter)


passport.use(
  new LocalStrategy(async (username, password, done) => {
      //Get user from database
      const user = await prisma.user.findFirst({
          where: {
              username: username
          }
      }
      );

      try{
          if(!user){
              return done(null, false, {message: "Incorrect username"})
          }
          const match = await bcrypt.compare(password, user.password)
          if(!match){
              return done(null, false, {message: "Incorrect passsword"})
          }

          return done(null, user)
      }catch(err){
          return done(err)
      }
  })
)

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser( async (id, done) => {
  console.log(id, 75)
  try{
      const user = await prisma.user.findFirst({where: {id: id}})
      console.log(user, 75)
      return done(null, user)
  }catch(err){
      return done (err)
  }
})


//app.get('*', (req, res) => {
    //res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  //});

app.listen(5000, () => {
    console.log('Server listening on port 5000')
})