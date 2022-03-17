//jshint esversion:6
///////////////////////loading dependencies//////////////////////////////////////
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const dotenv = require('dotenv').config();
const user = require(__dirname+'/mongomodule.js')
const passport = require('passport')
const session = require('express-session')
////////////////////////loading dependencies//////////////////////////////////////

/////////////////configs///////////////////////////////////////////////////////////
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({
  secret: "Rusty",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(user.createStrategy());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
////////////////////////////configs///////////////////////////////////////////////

///////////////////setting up server///////////////////////////////////////////////
app.listen(3000, ()=>{
  console.log('server is listening in the port 3000')
})
////////////////////////////////////////////////////////////////////////////////////

//////////////////routes///////////////////////////////////////////////////////////

/////////////////////////////////get-routes////////////////////////////////////////
app.get('/', (req, res)=>{
  if (req.isAuthenticated()){  res.render('home')}
  else {res.redirect('/login')}

})

app.get('/login', (req, res)=>{
  res.render('login')
})

app.get('/register', (req, res)=>{
  res.render('register')
})

app.get('/secret', (req, res)=>{
  if(req.isAuthenticated()){
    res.render('secrets')
  }
  else{
    res.redirect("/login")
  }
})

app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/')
})
///////////////////get-routes/////////////////////////////////////////////////////////

//////////////////////////post-routes////////////////////////////////////////////////
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){

});
app.post("/register", function(req, res){
    // console.log(req.body.username);
    // console.log(req.body.password);
    user.register(new user({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});


//////////////////////////post-routes////////////////////////////////////////////////
/////////////////routes/////////////////////////////////////////////////////////////////
