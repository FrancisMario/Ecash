

    const pool = require('./modules/dataBaseQueries/database')

// this function verifys that the user has enought money in there account b4 they can proceed with the transaction.
// It takes a user_id and transaction_amount as parameter
function verifyTransaction() {
    var sql = "";
    pool.query(sql, function (err, rows) {
      while (rows === undefined) {
    
        console.log(rows);
      }
      return rows;
  
    });
}

// verifying the transaction pin
function verifyTransactionPin(){

}

// 
function makeTransaction() {
    
}

module.exports = makeTransaction;
module.exports = verifyTransaction;
module.exports = verifyTransactionPin;