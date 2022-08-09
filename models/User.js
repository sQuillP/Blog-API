const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,`Please enter a name field for user`]
    },
    email:{
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ],
        unique: true,
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    password:{
        type:String,
        minlength:6,
        select: false
    }
});


UserSchema.pre('remove',async function(next){
    await this.model('Blog').deleteMany({author: this._id});
    next();
});



/* Warning! Synchronous bcrypt can cause performance issues. */

/* Hash User password for security purposes */
UserSchema.pre("save",function(next){
    if(this.isModified('password'))
        next();
    console.log('hashing password')
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password,salt);
    next();
});


UserSchema.pre("insertMany",function(next, documents){

    if(Array.isArray(documents) && documents.length){
        documents = documents.map(document => {
            const salt = bcrypt.genSaltSync(10);
            document.password = bcrypt.hashSync(document.password,salt);
        });
    }

    next();
});

/* Sign JWT with user id for logging into app */
UserSchema.methods.getSignedJwtToken = function() {
    console.log('in getsignedjwt')
    return jwt.sign({id: this._id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}



/* Return true if hash matches the password */
UserSchema.methods.matchPassword = function(plaintextPassword) {
    return bcrypt.compareSync(plaintextPassword, this.password);
}

module.exports = mongoose.model("User",UserSchema);