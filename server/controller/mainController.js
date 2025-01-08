const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { errors } = require("formidable");


const prisma = new PrismaClient();



async function createUser(res, req) {
  bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
    try {
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPass,
        },
      });
      res.json({ success: true, message: "User created successfully" });
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = {
  createUser,
};
