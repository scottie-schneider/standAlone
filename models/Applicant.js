var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
mongoose.Promise = global.Promise;
const applicantSchema = new mongoose.Schema({
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
applicantSchema.statics.authenticate = function(email, password, callback) {
  // Applicant.findOne({ 'email': email })
  //     .exec(function (error, user) {
  //       if (error) {
  //         return callback(error);
  //       } else if ( !user ) {
  //         var err = new Error('User not found.');
  //         err.status = 401;
  //         return callback(err);
  //       }
  //       bcrypt.compare(password, user.password , function(error, result) {
  //         console.log(` result is ${result}`);
  //         if (result === true) {
  //           return callback(null, user);
  //         } else {
  //           return callback();
  //         }
  //         return callback(null, user);
  //       })
  //     });
  var query = Applicant.findOne({ 'email' : 'jon@snow.com'});
  query.select('email password');
  query.exec(function(err, user){
  	console.log(user);
  	if (err) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
       bcrypt.compare(password, user.password , function(error, result) {
       	console.log(`password is ${password}`)
       	console.log(`user password is ${user.password}`)
          console.log(` result is ${result}`);
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
          return callback(null, user);
        })
  })
}
// hash password before saving to database
applicantSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});
var Applicant = mongoose.model('Applicant', applicantSchema);
module.exports = Applicant;
