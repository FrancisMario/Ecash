/*
*
*/

const mysql = require('mysql');

// making a query t db
 function getData(database,sql){

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: database
      });
      
    con.connect(function(err) {
        if (err) {return err;}
        con.query(sql, function (err, result, fields) {
          if (err) {console.log(err);}
          result.boolean = true;
          console.log(typeof(result));
          console.log(typeof(fields));
          console.log(typeof(err));
          return result;
        });
      });

}

// setting data to db
function setData(database,sql) {
    
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: database
          });
          
        con.connect(function(err) {
            if (err){ return err;}
            con.query(sql, function (err, result, fields) {
              if (err){ return false;}
              return true;
            });
          });
    
    }

    
module.exports.setData = setData;
module.exports.getData = getData;