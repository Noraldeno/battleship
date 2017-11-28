let db = require('../db');
let bcrypt = require('bcrypt');
const saltRounds = 10;

class Users{

  constructor(){
  }

  register(username, password, email){

    return new Promise( (resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(err, hash){
        if(err){
          reject(err);
        }

        db.any('INSERT INTO users(username, password, email) VALUES($1, $2, $3)', [username, hash, email]);
        resolve('success');

      })

    })

  }

  login(username, password){

    return new Promise( (resolve,reject) => {

      this.validateUser(username)
        .then( result => {
           if(result === false){
             resolve(false);
             return;
           }

           this.isPasswordMatch(password, result[0].password, response => {
             resolve(response);
           })
        })

    })

  }

  isPasswordMatch(inputPassword, hashedPassword, cb){
    bcrypt.compare(inputPassword, hashedPassword, function(err, response){
      cb(response);
    })
  }

  validateUser(username){

    return new Promise( (resolve,reject) => {

      db.any('SELECT * FROM users WHERE username = $1', username)
        .then(result =>{
          if(result[0] === undefined){
            resolve(false);
            return;
          }

          resolve(result);
        })
    })
  }

}

module.exports = Users;

