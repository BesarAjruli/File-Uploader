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

async function createFolder(req, res) {
  const name = req.body.name
  const userid = parseInt(req.body.userId)
  await prisma.folder.create({
    data: {
      name: name,
      userId: userid
    }
  }).catch(error => console.log(error))
  res.json({success: true})
}

async function getFolders(req){
  const userId = req.user.id
  const folders = await prisma.folder.findMany({where: {userId: userId}})
  return folders
}

async function getFiles(req, folderID){
  const folderId = parseInt(folderID)
  const files = await prisma.files.findMany({where: {folderId: folderId}})
  return files
} 

async function createFile(req, res) {
  const name = req.body.name
  const size = parseInt(req.body.size)
  const type = req.body.type
  const folderId = parseInt(req.body.folderId)
  await prisma.files.create({
    data: {
      name: name,
      size: size,
      type: type,
      folderId: folderId
    }
  }).catch(error => console.log(error))
  res.json({success: true})
}
module.exports = {
  createUser,
  createFolder,
  getFolders,
  getFiles,
  createFile
};
