live demo here: https://nodejs-jwt-login.herokuapp.com/

A login and log out application using NodeJS, EJS (embedded JavaScript), Express, bcrypt, passport. 
This was made to be used and built on for future projects where login/logout functions are needed.

NOTES FOR MYSELF: (for future deployments)
In the root directory of your project you can set your config vars there using the command
heroku config:set SECRET_SESSION="secretName"      <--if this doesn' work use the "app.use" code below but then it wont be a 'secure' session.


When I deployed to Heroku it kept giving me an "Internal server error". Once checking the logs, it showed me 'Error: secret option required for sessions'.

Here is how I fixed it:

app.use(session({
  secret: 'secretidhere',    <-- 
  resave: false, 
  saveUninitialized: false
}))
