const express = require ('express');
const path = require ('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator= require('express-validator');
const flash= require('connect-flash');
const session= require('express-session');
const passport= require('passport');
const config = require('./config/database');

mongoose.connect(config.database);

let db = mongoose.connection;

//check for db connection

db.once('open',function(){
    console.log('connected tomongoDB');
});


//check for DB error

db.on('error',function(err){
    console.log(err)
})

//init app

const app = express();

// bring in models
 
let Article = require('./models/article')

//Load View engine

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

//set bublic folder

app.use(express.static(path.join(__dirname,'public')));


//express-session

app.use(session({
  secret: 'keyboard cat',
  resave:true,
  saveUninitialized: true,
}))

//express-messages

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express-validator

app.use(expressValidator({
    errorFormatter: function(param, msg, value ){
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            mas : msg,
            value : value
        };
        }
    
}));


//body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

//parse aplication json

app.use(bodyParser.json());


//Passport cofig
require('./config/passport')(passport);

//passport middleware

app.use(passport.initialize());
app.use(passport.session());

//Global routing

app.get('*', function(req,res,next){
    res.locals.user = req.user || null;
    next();
});

//Hoem Route

app.get ('/',function (req,res){
    
//    let articles = [
//        {
//        id :1,
//        title:"life risk",
//        author:'sab',
//        body:'this is about life1'
//        },
//         {
//        id :2,
//        title:"life risk",
//        author:'sab2',
//        body:'this is about life2'
//        },
//         {
//        id:3,
//        title:"life risk",
//        author:'sab3',
//        body:'this is about life3'
//        },
//    ]
    
    Article.find({},function(err,articles){
        
        if(err){
            console.log(err);
        }else{
        res.render("index",{
        title:"post and view",
        articles:articles
        });
        }
    });
    
    
    
})



//add Router

app.get('/articles/add',function(req,res){
    
     res.render("add",{
        title:"Add Post"
    });
});

//view render
app.get('/articles/view',function(req,res){
    
    Article.find({},function(err,articles){
        
        if(err){
            console.log(err);
        }else{
        res.render("view",{
        title:"View Post",
        articles:articles
        });
        }
    });
});
//add submit POST route for add.pug

app.post('/articles/add',function(req,res){
    
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('author', 'author is required').notEmpty();
    req.checkBody('body', 'body is required').notEmpty();
    
    //get Error
    
    let errors= req.validationErrors();
    
    if(errors){
        res.render('add',{
            title:"Add Members",
            errors:errors
        })
    }else{
    let article = new Article();
    article.title=req.body.title;
    article.body=req.body.body;
    article.author=req.body.author;
    
    article.save(function(err){
        if(err){
            console.log(err);
        }else
            {
                req.flash('success','successfully added')
                res.redirect('/articles/view');
            }
    })    
    }
    });


//add router for click articles

app.get('/artDetail/:id', function (req,res){
    
    Article.findById(req.params.id , function(err,artDetail){
        res.render('artDetail',{
            art:artDetail
            
        });
        
        
    });
    
});

//add router for edit articles

app.get('/article/edit:id', function (req,res){
    
    Article.findById(req.params.id , function(err,artDetail){
        res.render('artEdit',{
            title:"Update",
            art:artDetail
            
        });
        
        
    });
    
});


//add Update detail POST route for addEdit.pug

app.post('/articles/update:id',function(req,res){
    let article = {};
    article.title=req.body.title;
    article.body=req.body.body;
    article.author=req.body.author;
    
    let query = {_id:req.params.id}
    
    Article.update(query,article,function(err){
        if(err){
            console.log(err);
            return;
        }else
            {
                req.flash('success','successfully updated')
                res.redirect('/');
            }
    })
});


//Delete Records from article

app.delete('/article/:id', function(req,res){

    
let query = {_id:req.params.id}    
    
Article.remove(query, function(err){
        if(err)
            {console.log(err);}
            
                res.send('sucess');
            
            
    });
});




//Route files

let users = require('./routes/users');
app.use('/users', users);


//Start server
app.listen(2000, function(){
           console.log('server is running on 20000');
           })
