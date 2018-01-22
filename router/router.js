console.log('loading router module')
var express = require('express');
var router = express.Router();
const passport = require('passport');
const Users = require('../models/users');//loading table model


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    let d = new Date();
    console.log('Time: ', d.toString())//just to log request time
    next()
})
// define the home page route(we using handler function chaining for one route)
router.route('/')
    .get((req, res)=>{
        console.log('serving a login page')
        res.render('login',{
            message: "if you are ready to login - fill in the info below",
            title: "hi there"
        })
    })
    .post((req, res)=>{
        let email = req.body.email;
        let password = req.body.password;
        console.log('someone is trying to login', email, password)
        Users.findOne({
            where:{
                email: email,
                password: password
            }
        }).then(result => {
            // res.send(result)
            res.render('successlogin',{
                name: result.name,
                title: 'what up'
            })
        }).catch(error=>{
            // res.status(400).send('error') - this is just to send error
            res.render('login',{
                message: "you need to register or check password"
            })
        })
    })

    .delete((req, res)=>{
        res.send("let's delete your account")//we'll use ajax request for it
    })

//registering routes info
router.route('/register')
    .get((req, res)=>{
        console.log('serving register page');
        res.render('register', {
            message: "be honest here"
        })
    })
    .post((req, res)=>{
        //body property is available because we have a body-parser
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        console.log('reading from register form: ', name, email, password)
        Users.findOne({
            where: { email: email}, // we search for this user
        }).then(result => {
            console.log('then in register post', result)
            if (result === null){
                Users.create({
                    email: email,
                    password: password,
                    name: name
                }).then(result => {
                    res.render('successlogin',{
                        name: name,
                        title: 'success register'
                    })
                }).catch(error => {
                    // console.log('catch error', error)
                    res.render('register', {
                        message: 'make sure all fields are filled in'
                    })
                })
            }else{
                res.render('login', {
                    message: 'your email already in database - login'
                })
            }
        }).catch(result => {
            res.render('register',{
                message: 'something went wrong, try again'  
            }) 
        })
})

router.get('/successlogin',(req, res)=>{
    res.render('successlogin')
})

module.exports = router;
