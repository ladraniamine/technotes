const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//get all users
const getAllUsers = asyncHandler(async (req,res)=>{
  const users = await User.find().select('-password').lean()
  if(!users?.length){
    return res.status(400).json({message: 'users not found'})
  }
  res.json(users)
})

//create new user
const createNewUser = asyncHandler(async (req,res)=>{
  const {username , password , roles} = req.body

  //confirm data
  if(!username || !password || !Array.isArray(roles) || !roles.length){
    return res.status(400).json({message: 'all fields are required'})
  }
  //check duplicate 
  const duplicate = await User.findOne({username}).lean().exec()
  if(duplicate){
    return res.status(409).json({message:'this user is used befor'})
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(password , 10) 

  //object user
  const userObject = {username , password:hashedPassword , roles}
  const user = await User.create(userObject)
  if(user){
    //user created successfuly
    res.status(201).json({message: `new username ${user.username} is created`})   
  }else{
    return res.status(400).json({message: 'Invalide user data recieved'})
  }
})

//update user
const updateUser = asyncHandler(async (req,res)=>{
  const {id , username , password , roles, active , } = req.body

  if(!username || !id || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean' ){
    return res.status(400).json({message: 'all fields are required'})
  }

  const user = await User.findById(id).exec()
  console.log(user)
  if(!user){
    return res.status(400).json({message: 'user not found !'})
  }

  //check the duplicate
  const duplicate = await User.findOne({username}).lean().exec()

  //allow to the original user
  if(duplicate && duplicate?._id.toString !== id){
    return res.status(409).json({message: 'duplicate user'})
  }

  user.username = username
  user.roles = roles
  user.active = active 

  if(password){
    //hash the password 
    const hashPassword = await bcrypt.hash(password , 10) //salt round
    user.password = hashPassword
  }

  const updateUser = await user.save()
  res.json({message: `${updateUser.username} updated :)`})
})

//delete user
const deleteUsers = asyncHandler(async (req,res)=>{
      const {id} = req.body
      if(!id){
        return res.status(400).json({message: 'user id required'})
      }

      // Does the user still have assigned notes?
      const notes = await Note.findOne({user: id}).lean().exec()
        if(notes?.length){
          return res.status(400).json({message: 'user has assigned notes !'})
        }

        const user = await User.findById(id).exec()
        if(!user){
          return res.status(400).json({message: 'user not found !'})
        }

        const result = await user.deleteOne()
        const reply = `username ${result.username} with the ID ${result.id} has deleted`
        res.json({message: reply})
})

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUsers
}