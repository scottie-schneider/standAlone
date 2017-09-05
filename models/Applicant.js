var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	middleName: {
		type: String,
		required: true,
		trim: true
	},
	lastName: {
		type: String,
		required: true,
		trim: true 
	},
	contactPhone: {
		type: Number,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	address: {
		type: String,
		required: true,
	},
	zip: {
		type: Number,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	tags: [String],
	status: {
		type: String,
		default: 'Pending'
	} 
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
 User.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
  // var query = Applicant.findOne({ 'email' : 'jon@snow.com'});
  // query.select('email password');
  // query.exec(function(err, user){
  // 	console.log(user);
  // 	if (err) {
  //         return callback(error);
  //       } else if ( !user ) {
  //         var err = new Error('User not found.');
  //         err.status = 401;
  //         return callback(err);
  //       }
  //      bcrypt.compare(password, user.password , function(error, result) {
  //      	console.log(`password is ${password}`)
  //      	console.log(`user password is ${user.password}`)
  //         console.log(`result is ${result}`);
  //         if (result === true) {
  //           //return callback(null, user);
  //           return res.send('ya');
  //         } else {
  //           //return callback();
  //           return res.send('no');
  //         }
  //       })
  // })
}
// hash password before saving to database
// hash password before saving to database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});
var User = mongoose.model('User', UserSchema);
module.exports = User;
