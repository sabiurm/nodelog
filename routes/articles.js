//const express = require ('express');
//const router = express.router();
//
//
////add Router
//
//app.get('/articles/add',function(req,res){
//    
//     res.render("add",{
//        title:"Add Members"
//    });
//});
//
////add submit POST route for add.pug
//
//app.post('/articles/add',function(req,res){
//    
//    req.checkBody('title', 'title is required').notEmpty();
//    req.checkBody('author', 'author is required').notEmpty();
//    req.checkBody('body', 'body is required').notEmpty();
//    
//    //get Error
//    
//    let errors= req.validationErrors();
//    
//    if(errors){
//        res.render('add',{
//            title:"Add Members",
//            errors:errors
//        })
//    }else{
//        let article = new Article();
//    article.title=req.body.title;
//    article.body=req.body.body;
//    article.author=req.body.author;
//    
//    article.save(function(err){
//        if(err){
//            console.log(err);
//        }else
//            {
//                req.flash('success','successfully added')
//                res.redirect('/');
//            }
//    })    
//    }
//    });
//
//
////add router for click articles
//
//app.get('/artDetail/:id', function (req,res){
//    
//    Article.findById(req.params.id , function(err,artDetail){
//        res.render('artDetail',{
//            art:artDetail
//            
//        });
//        
//        
//    });
//    
//});
//
////add router for edit articles
//
//app.get('/article/edit:id', function (req,res){
//    
//    Article.findById(req.params.id , function(err,artDetail){
//        res.render('artEdit',{
//            title:"Update",
//            art:artDetail
//            
//        });
//        
//        
//    });
//    
//});
//
//
////add Update detail POST route for addEdit.pug
//
//app.post('/articles/update:id',function(req,res){
//    let article = {};
//    article.title=req.body.title;
//    article.body=req.body.body;
//    article.author=req.body.author;
//    
//    let query = {_id:req.params.id}
//    
//    Article.update(query,article,function(err){
//        if(err){
//            console.log(err);
//            return;
//        }else
//            {
//                req.flash('success','successfully updated')
//                res.redirect('/');
//            }
//    })
//});
//
//
////Delete Records from article
//
//app.delete('/article/:id', function(req,res){
//
//    
//let query = {_id:req.params.id}    
//    
//Article.remove(query, function(err){
//        if(err)
//            {console.log(err);}
//            
//                res.send('sucess');
//            
//            
//    });
//});
