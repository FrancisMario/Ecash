/*
 *
 */

// add new user to the system
const crypto = require('crypto');

function AddNewUser(userDetails) {
    var pool = require('./dataBaseQueries/database'); // mysqli instance

    var user_id = createUserId(userDetails.phone);
    var password = crypto.createHash('md5').update(userDetails.password).digest("hex");
    console.log(userDetails);
    // adding user to accounts table
    var sql = "INSERT INTO users (name, lastname,displayname,phone,email,transaction_key,comfirmation_key,user_id,table_id,password)" +
        "VALUES ('" + userDetails.name + "','" + userDetails.lastname + "','" + userDetails.displayname + "','" +
        userDetails.phone + "','" + userDetails.email + "','" + createUserId(userDetails.email + userDetails.displayname) + "','" + userDetails.comfirmationkey + "','" + user_id + "','" + userDetails.tableid + "','" + password + "');";
    var sql_2 = "CREATE TABLE " + user_id + " ( table_id INT AUTO_INCREMENT, transaction_id VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL, transaction_date DATE,transaction_time TIME,transaction_type VARCHAR(255),transaction_amount VARCHAR(255) , transaction_currency VARCHAR(5),transaction_reciept BOOLEAN,previous_transaction_hash TEXT TEXT CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,transaction_hash TEXT CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,description TEXT, PRIMARY KEY (table_id)) ENGINE=INNODB;";

    pool.query(sql, function (err, result, fields) {
        if (err) throw new Error(err)
        // Do something with result.
        pool.query(sql_2, function (err, result, fields) {
            if (err) throw new Error(err)
            if (userDetails.accType === "business") {
                var sql0 = "INSERT INTO `business_clients_balance` (`table_id`, `user_id`, `balance`) VALUES (NULL," + user_id + " , " + 00 + ")";
            } else {
                var sql1 = "INSERT INTO `personal_clients_balance` (`table_id`, `user_id`, `balance`) VALUES (NULL," + user_id + " , " + 00 + ")";
            }
            pool.query(sql_2, function (err, result, fields) {
                if (err) throw new Error(err)
                return true;
            });

        });
    });
}

function createUserId(id) {


    let hash = crypto.createHash('md5').update(id).digest("hex");

    return hash;


}

module.exports.AddNewUser = AddNewUser;
// creatuserId function