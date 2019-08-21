 //  Decleration of Dependence 
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const verifyPhone = require('./modules/verifyNumber');
const token = require('./modules/security/tokens');
const pool = require('./modules/dataBaseQueries/database')
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

// Second wave of info, recieving name, email, and phone of user 
router.post('/submit-info', function (req, res) {
  userDetails.name = req.body.user.name;
  userDetails.lastname = req.body.user.lastname;
  userDetails.email = req.body.user.email.toLowerCase();
  userDetails.phone = req.body.user.accType;
  userDetails.accType = req.body.user.phone;
  // redirecting to a new file
  res.sendFile(path.join(__dirname + '/signup.html'));
  // res.end();
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
router.post('/login', function (req, res) {

  // var pool = require('./modules/dataBaseQueries/database'); // mysqli instance
  const crypto = require('crypto')

  var id = req.body.user.username.toLowerCase();
  var key = req.body.user.password;


  let password = crypto.createHash('md5').update(key).digest("hex");
  var sql = "SELECT * FROM users WHERE email = '" + id + "' OR phone = '" + id + "' AND password = '" + password + "';";
  // Authenticating the user
  pool.query(sql, function (err, result, fields) {
    if (err) console.log("database is not live");
    // res.write("Welcome" + result.name);
    // res.end();
    // console.log(typeof(result[0].user_id));
    console.log(true);
    if (true) { // TODO Modify this to properly check for Credencial
      console.log(false);
	  // redirecting to a new file
		res.sendFile(path.join(__dirname + '/signup.html'));
    } else {
      // generating session token
      var session_id = token.generateSessionToken();
      console.log("server-token: " + session_id);

      // registering session
      var sql = "INSERT INTO `active_sessions` (`id`, `session_id`, `user_id`, `timer`) VALUES (NULL, '" + session_id + "', '" + result[0].user_id + "', " + 30 + ")";
      pool.query(sql, function (err, result, fields) {
        if (err) concole.log("database is not live");
        // sending @param(session_id) the response back to server if session was successfully created
        res.write(session_id);
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


// 
function verifySession(session_id) {

  var sql = "SELECT user_id FROM active_sessions WHERE session_id = '" + session_id + "';";
  pool.query(sql, function (err, rows) {
    while (rows === undefined) {

      console.log(rows);
    }
    return rows;

  });
}

//InSession request
router.post('/getData', function (req, res) {
  var session_id = req.body.session_key; //  the session key, nessesary for resource access
  var type = req.body.req_type; // specifies what resource to send
  var user_id = null;
  console.log("verifying session");
  var sql = "SELECT user_id FROM active_sessions WHERE session_id = '" + session_id + "';";
  pool.query(sql, function (err, rows) {
    console.log(rows);
    // console.log(user_id);
    if (rows[0] != undefined) {
      user_id = rows[0].user_id;
      switch (type) {

        case "home":
          var sql = "SELECT * FROM users WHERE user_id = '" + user_id + "';";
          pool.query(sql, function (err, rows) {
            console.log("hompage is on");
            console.log(sql);
            console.log(rows[0]);
            //  console.log(err);
            //  console.log(verifySession(id));
            var response = '{"table_id": "' + rows[0].table_id + '","name":"' + rows[0].name + '","lastname": "' + rows[0].lastname + '","displayname": "' + rows[0].displayname + '","phone": "' + rows[0].phone + '","email": "' + rows[0].email + '"}';
            res.write(response);
            console.log(rows);
            console.log(JSON.parse(response));

            res.end();
          });
          break;

        case "balance":
          var sql = "SELECT * FROM " + user_id + " WHERE 1;";
          pool.query(sql, function (err, rows) {
            console.log(sql);
            console.log(rows);
            if (rows[0] === undefined) {
              res.write('404');
            } else {

              res.write(rows[0].current_balance);
              res.end();
            }
          })
          break;

        case "account":
          var sql = "SELECT * FROM users WHERE user_id = " + user_id;
          pool.query(sql, function (err, rows) {
            res.write(rows);
            res.end();
          })
          break;

        case "settings":
          var sql = "SELECT * FROM users WHERE user_id = " + user_id;
          pool.query(sql, function (err, rows) {
            res.write(rows);
            res.end();
          })
          break;


        default:
          break;
      }
    } else {
      res.write("SESSION_NOT_FOUND");
      res.end();
    }


  });


});

router.post('/verifySession', function (req, res) {

  var sql = "SELECT user_id FROM active_sessions WHERE session_id = '" + req.body.data + "';";
  pool.query(sql, function (err, rows) {
    console.log(sql)
    console.log(rows);
    console.log(rows[0]);
    console.log(rows[0]["user_id"]);

    if(rows[0] === undefined){
    res.write("404");
    res.end();
    } else {
      res.sendFile(path.join(__dirname + '/home.html'));
      // res.end();
    }
  });

});

// Transaction processor 
router.post('/transaction', function (req, res) {

      var transactionDeatails = {};

      transactionDeatails.destination = req.body.details.destination;
      transactionDeatails.description = req.body.details.description;
      transactionDeatails.curency = req.body.details.currency;
      transactionDeatails.amount = req.body.details.amount;
      transactionDeatails.accType = req.body.details.accType;
      transactionDeatails.session_id = req.body.details.session_id;
      transactionDeatails.date = new Date();
      // making sure the amount is not a negetive number
      if (transactionDeatails.amount < 1) {
        res.write("INVALID_TRANSACTION_AMOUNT");
        res.end();
        return false;
      }

      // verifying the session
      var sql = "SELECT user_id FROM active_sessions WHERE session_id = '" + session_id + "';";
      pool.query(sql, function (err, rows) {

        if (rows[0].user_id === undefined) {
          res.write("USER_NOT_SIGNED_IN");
          res.end();
          process.end();
        }
        transactionDeatails.user_id = rows[0].user_id;

        // SELECT TOP 1 * FROM active_session ORDER BY ID DESC 
        // verifying if transaction is possible due to enough founds in account
        if (transactionDeatails.accType === "business") {
          sql = "SELECT balance FROM `business_clients_balance` WHERE user_id = '" + user_id + "';";
        } else {
          sql = "SELECT balance FROM `personal_clients_balance` WHERE user_id = '" + user_id + "';";
        }
        pool.query(sql, function (err, result, fields) {
          // checking compairing the balance and the transaction amount
          if (result[0].current_balance === undefined || result[0].current_balance < transactionDeatails.amount) {
            res.write("INSUFFICIENT_FOUNDS");
            res.end();
            return false;
          }


          // Making transaction, ie. adding to master ledger.
          var sql = "INSERT INTO `master_ledger` (`transaction_id`, `transaction_amount`, `transaction_sender`, `transaction_recipient`, `transaction_date`, `transaction_time`, `previous_hash`, `hash`)  VALUES (NULL, " + transactionDeatails.amount + "," + user_id + ", " + transactionDeatails.destination + ", CURRENT_DATE(), CURRENT_TIME(), " + getPreviousHash('master') + ", " + makeTransactionhash(userDetails) + ");";
          pool.query(sql, function (err, result, fields) {

            // recording transaction to recipient personal ledger
            var sql = "SELECT * FROM users WHERE email = '" + id + "' OR phone = '" + id + "' AND password = '" + password + "';";
            pool.query(sql, function (err, result, fields) {
              // recording transaction to recipient personal ledger
              var sql = "SELECT * FROM users WHERE email = '" + id + "' OR phone = '" + id + "' AND password = '" + password + "';";
              pool.query(sql, function (err, result, fields) {

                // responding to client
                res.write("TRANSACTION_SUCCESFULL");
                res.end();
              });
            });
          });

        });


      });

    });

      //add the router
      app.use(express.urlencoded());
      app.use(express.static('assets'));
      app.use('/', router);
      // app.use(compression());
      app.listen(process.env.port || 8080);
      console.log('Running at Port 8080');