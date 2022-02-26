const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

// router.get('/test', (req,res) => {
//     res.send('from new file route')
// })

router.post('/users', async (req, res) => {
    // console.log(req.body)
    // res.send('Testing!')

    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token})
    } catch (e) {
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    //     // res.send(e)
    // })
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()

        // res.send({ user: await user.getPublicProfile(), token})
        res.send({ user, token})
    }catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth ,async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []

        await req.user.save()
        res.send()
    }catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){           //file contain details of file being upload and cb is used when we are done filtering using multer
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){        //regular expression is used
            // return cb('please upload a pdf')
            return cb(new Error('please upload a jpg/jpeg/png'))
        }

        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    // req.user.avatar = req.file.buffer     //saving img file to model
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer

    await req.user.save()

    res.send(req.user)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
})

router.get('/users/:id/avatar',  async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        // const user = User.findById(req.user._id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch (e) {
        res.status(404).send()
    }
})

router.get('/users/me', auth ,async (req, res) => {

    res.send(req.user)

    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (e) {
    //     res.status(500).send()
    // }

    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

// router.get('/users/:id', async (req, res) => {
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

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const user = await User.findById(req.user._id)
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()

        // if (!user) {
        //     return res.status(404).send()
        // }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router