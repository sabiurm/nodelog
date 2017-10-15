const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport= require('passport');

//bring in the user from models folder

let User = require('../models/user');


//Register form api

router.get('/register', function(req,res){
    res.render('register');
});


//Register Process
router.post('/register', function(req,res){
    
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2= req.body.password2;

    req.checkBody('name','name is required').notEmpty();
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('email','email is not valid').isEmail();
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','name is required').equals(req.body.password);
    
    let errors = req.validationErrors();
    
    if(errors){
        res.render('register',{
            errors:errors
        });
    }else{
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });
        
        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }                 
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        req.flash('success','you are registered successfully');
                        res.redirect('/users/login');
                    }
                })
            })
        })
    }

})


//login router

router.get('/login', function(req,res){
    res.render('login');
});

//Login Process

router.post('/login', function(req,res,next){
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});


//Logout Router

router.get('/logout', function(req,res){
    req.logout();
    req.flash('success','successfully logged out');
    res.redirect('/users/login');
});

//

module.exports = router;