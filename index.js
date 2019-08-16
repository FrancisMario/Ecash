//  Decleration of Dependence 
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const verifyPhone = require('./modules/verifyNumber');
const token = require('./modules/security/tokens');
const path = require('path');
const app = express();
// const compression = require('compression');
const router = express.Router();

var userDetails = {};

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
  // res.end();
});


// verifying the provided number
router.post('/verify-number', function (req, res) {
  console.log("verifying phone");
  if (true) {
    res.write("200");
  } else {
    res.write("404");
  }
  res.end();
});


// Submitting credentials for final processing
router.post('/submit-credentials', function (req, res) {
  var processor = require("./modules/accountSetup")
  userDetails.password = req.body.user.password;
  userDetails.code = req.body.user.code;
  if (processor.AddNewUser(userDetails)) {

    console.log(userDetails.name + "has been added to the system");
    res.write("signedUP Sucessfuly");
    res.end();
  } else {
    console.log(userDetails.name + "was not added to the system");

  }
});

// Second wave of info, recieving name, email, and phone of user 
router.post('/submit-info', function (req, res) {
  userDetails.name = req.body.user.name;
  userDetails.lastname = req.body.user.lastname;
  userDetails.email = req.body.user.email.toLowerCase();
  userDetails.phone = req.body.user.phone;
  console.log(userDetails.name);
  console.log(userDetails.email);
  console.log(userDetails.phone);
  // redirecting to a new file
  res.sendFile(path.join(__dirname + '/signup.html'));
  // res.end();
});

// Second wave of info, recieving name, email, and phone of user 
router.post('/login', function (req, res) {

      var database = require("./modules/dataBaseQueries/database");
      var pool = require('./modules/dataBaseQueries/database'); // mysqli instance
      const crypto = require('crypto')

      var id = req.body.user.username.toLowerCase();
      var key = req.body.user.password;


      let password = crypto.createHash('md5').update(key).digest("hex");
      var sql = "SELECT * FROM users WHERE email = '" + id + "' OR phone = '" + id + "' AND password = '" + password + "';";
      // Authenticating the user
      pool.query(sql, function (err, result, fields) {
        if (err)concole.log("database is not live");
        // res.write("Welcome" + result.name);
        // res.end();
        // console.log(typeof(result[0].user_id));
        console.log(true);
        if (result.length == 0) {
          console.log(false);
        } else {
            // generating session token
            var session_id = token.generateSessionToken();
            console.log("server-token: " + session_id);
          
          // registering session
          var sql = "INSERT INTO `active_sessions` (`id`, `session_id`, `user_id`, `timer`) VALUES (NULL, '"+session_id+"', '"+ result[0].user_id +"', "+30+")";
          pool.query(sql, function (err, result, fields) {
            if (err)concole.log("database is not live");
            // sending @param(session_id) the response back to server if session was successfully created
            res.write(session_id );
            res.end();
          });
             
            }

            // console.log(result[0].name);
            // console.log(fields);
          });


      });

      // Second wave of info, recieving name, email, aznd phone of user 
      router.post('/login/Ok', function (req, res) {
        
        res.sendFile(path.join(__dirname + '/home.html'));
        // res.end();
        console.log(req.body);
    
      });

          //InSession reqquest
      router.post('/getData', function (req, res) {
        var id = req.body.session_key; //  the session key, nessesary for resource access
        var type = req.body.req_type;// specifies what resource to send

        // Verifying session
        var outOfVariableNames = verifySession(session_key);
        if(outOfVariableNames === false){
            res.write("404");
        }else {
          // getting user details for the logged in user
          var sql = "SELECT * FROM users WHERE user_id = "+ outOfVariableNames +";";
          pool.query(sql, function (err, result, fields) {
            if (err)concole.log("database is not live");
            // sending @param(session_id) the response back to server if session was successfully created
            res.write(session_id );
            res.end();
          });
        }


        // res.end();
        console.log(req.body);
    
      });



      //add the router
      app.use(express.urlencoded());
      app.use(express.static('assets'));
      app.use('/', router);
      // app.use(compression());
      app.listen(process.env.port || 8080);
      console.log('Running at Port 8080');