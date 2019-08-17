
const pool = require('./modules/dataBaseQueries/database'); // mysqli instance

function gethomePagestuff(outOfVariableNames,callback){

     // getting user details for the logged in user
     var sql = "SELECT * FROM users WHERE user_id = "+ outOfVariableNames +";";
     pool.query(sql, function (err, result, fields) {
       if (err){concole.log("database is not live"); return callback(true, "Database Error"); } 
       // sending @param(result[0]<json>) the response back to client
       return result;
     });

}