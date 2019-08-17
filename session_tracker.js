//  Decleration of Dependence 
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const router = express.Router()

var ACTIVE_SESSION = [];


// Main Req Handler
router.post('/', function (req, res) {
    res.write("WELCOME");
    console.log("Hello mario, you got a request..!");
    console.log(req.get('content'))
    res.end();
});

// session printer
router.get('/print_sessions', function (req, res) {
    if (ACTIVE_SESSION === null) {
        return false;
    }
    ACTIVE_SESSION.find(function (currentValue, index, arr) {
        res.write(currentValue.user_id);
        res.end();
    })
    
});

// setting up sessions
function set_up_session(id) {

    //  verifying that the user is not already logged in.
    if (retrieve_session(id) != true) {
        return true;
    } else {
        return false;
    }

}

// Searchs the session array for a sessions, using the @PARAM<id>,
// Returns object
function retrieve_session(id) {
    if (id === ACTIVE_SESSION.find(function (currentValue, index, arr) {
            if (currentValue === id) {
                return currentValue.session_id
            }
        })) {
        return true;
    } else {
        return false;
    }

}

// Returns object
function set_session(id) {

    // checking if session is not already active
    if (id === retrieve_session(id)) {
        return "ERR_SESSION_IS_ALREADY_ACTIVE";
    }

    var token = require("./modules/security/tokens");
    var session_id = token.generateSessionToken();

    var obj = {
        user_id: id,
        session_id: session_id,
    }

    // registering the session
    if (ACTIVE_SESSION.push(obj)) {
        return true;
    } else {
        return "ERR_SESSION_NOT_SET";
    }

}

//add the router
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/', router);
// app.use(compression());
app.listen(process.env.port || 1000);
console.log('Running at Port 1000');