const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// ------------------ multer to upload image ----------------------
// const multer = require('multer')
// const upload = multer({
//     dest: 'images',    //destination
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){           //file contain details of file being upload and cb is used when we are done filtering using multer
//         // if(!file.originalname.endsWith('.pdf')){
//         if(!file.originalname.match(/\.(doc|docx)$/)){        //regular expression is used
//             // return cb('please upload a pdf')
//             return cb(new Error('please upload a word document'))
//         }

//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message})
// })


// middleware function  //rather use here we create new folder for middleware and create file for it and use it
// app.use((req, res, next) => {
//     // console.log(req.method, req.path)
//     // next()

//     // res.status(503).send('maintenance is going on')
// })

app.use(express.json()) //parse incoming json automatically
app.use(userRouter)
app.use(taskRouter)

// const router = new express.Router()
// router.get('/test', (req,res) => {
//     res.send('this is from another route')
// })
// app.use(router) //to use router

// ---------------------------------------------- user.js ----------------------------------------------------
// app.post('/users', async (req, res) => {
//     // console.log(req.body)
//     // res.send('Testing!')

//     const user = new User(req.body)

//     try {
//         await user.save()
//         res.status(201).send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }

//     // user.save().then(() => {
//     //     res.status(201).send(user)
//     // }).catch((e) => {
//     //     res.status(400).send(e)
//     //     // res.send(e)
//     // })
// })

// app.get('/users', async (req, res) => {

//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send()
//     }

//     // User.find({}).then((users) => {
//     //     res.send(users)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

// app.get('/users/:id', async (req, res) => {
//     // console.log(req.params)
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }

//     // User.findById(_id).then((user) => {
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }

//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

// app.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// app.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
// ---------------------------------------------------------------------------------------------

// -------------------------------------------- task.js --------------------------------------------
// app.post('/tasks', async (req, res) => {
//     const task = new Task(req.body)

//     try {
//         await task.save()
//         res.status(201).send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }

//     // task.save().then(() => {
//     //     res.status(201).send(task)
//     // }).catch((e) => {
//     //     res.status(400).send(e)
//     // })
// })

// app.get('/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         res.send(tasks)
//     } catch (e) {
//         res.status(500).send()
//     }

//     // Task.find({}).then((tasks) => {
//     //     res.send(tasks)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

// app.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const task = await Task.findById(_id)
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }

//     // Task.findById(_id).then((task) => {
//     //     if(!task){
//     //         return res.status(404).send()
//     //     }

//     //     res.send(task)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

// app.patch('/tasks/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'updates invalid!' })
//     }

//     try {
//         const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// app.delete('/tasks/:id', async (req,res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id)
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }catch (e) {
//         res.status(500).send()
//     }
// })

app.listen(port, () => {
    console.log('server is up on port ' + port)
})

// ----------- password bcrypt --------------------
// const bcrypt = require('bcryptjs')

// const myFunction = async () => {
//     const password = 'Red12345!'
//     const hashedPassword = await bcrypt.hash(password,8)

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('Red12345!',hashedPassword)
//     console.log(isMatch)
// }

// myFunction()

// ------------------------ jsonwebtoken -------------------
// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()

// ------------ JSON.stringify is called when we send object like res.send(user) --------------------------------------
// const pet = {
//     name: 'hal'
// }

// pet.toJSON = function () {
//     return {}
// }

// console.log(JSON.stringify(pet))

//---------------------------------- geting user from task ----------------------
// const test1 = async ()=> {
    // this is for task to get owner
    // const task = await Task.findById('620e032a32561ed49eb672ae')
    // await task.populate('owner')
    // console.log(task.owner)

    // this is for owner to get task
    // const user = await User.findById('620e02e2a3713aa82ba50b88')
    // await user.populate('tasks')
    // console.log(user.tasks)
// }

// test1()