

        var res = null;

// Verifying password
 function authenticateUser(id,key,res) {
    const crypto = require('crypto')
    var database = require("./../dataBaseQueries/database");
    var pool = require('./../dataBaseQueries/database'); // mysqli instance
    var state = false;
    this.res = res;
    
    // console.log(key);
    // console.log(id);
    
    let password = crypto.createHash('md5').update(key).digest("hex");
        var sql = "SELECT * FROM users WHERE email = '" + id + "' OR phone = '" + id + "' AND password = '" + password + "';";
        pool.query( sql, function (err, result, fields)  {
            if (err) throw new Error(err)
            this.res.write("signedUP Sucessfuly");
            res.end();
        });        
        
}

module.exports.authenticateUser = authenticateUser;
