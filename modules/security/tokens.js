
var randomstring = require("randomstring");

function generateSessionToken(){
  
const val = randomstring.generate({
  length: 50,
  charset: 'alphanumeric'
});

return val;

}

module.exports.generateSessionToken = generateSessionToken;