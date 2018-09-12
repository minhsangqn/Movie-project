const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const memberSchema = new Schema({
    info: {
        firstname: String,
        lastname: String,
        phone: String,
        company: String,
        address: String,
        cities: [{ type: Schema.ObjectId, ref: 'City' }], // store array city _id
        countries: [{ type: Schema.ObjectId, ref: 'Country' }], // store array country _id
    },
    local: { // Use local
        email: String,
        password: String,
        adminPin: String,
        activeToken: String,
        activeExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    facebook: { // Use passport facebook
        id: String,
        token: String,
        email: String,
        name: String,
        photo: String
    },
    google: { // Use passport google
        id: String,
        token: String,
        email: String,
        name: String,
        photo: String
    },
    newsletter: Boolean, // True or false
    roles: String, //ADMIN, MOD, MEMBER, VIP
    status: String //ACTIVE, INACTIVE, SUSPENDED
}, {
    timestamps: true
});
//-----------------------khoi tao phuong thuc-------------------------
// Mã hóa mật khẩu
memberSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// Giải mã mật khẩu
memberSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Valid pin code
memberSchema.methods.validPinCode = function(pincode) {
    return bcrypt.compareSync(pincode, this.local.adminPin);
};

//check Admin
memberSchema.methods.isGroupAdmin = function(checkRoles){
    if(checkRoles === 'ADMIN' ){
        return true;
    }else {
        return false;
    }
};
memberSchema.methods.isNullAdminPin = function(adminPin){
  if(adminPin, this.local.adminPin === null){
      return true
  }else {
      return false
  }
};

memberSchema.methods.isInActivated = function(checkStatus){
    if(checkStatus === 'INACTIVE'){
        return true;
    }else {
        return false;
    }
};

memberSchema.methods.isSuspended = function(checkStatus){
    if(checkStatus === 'SUSPENDED'){
        return true;
    }else {
        return false;
    }
};

module.exports = mongoose.model('Member', memberSchema);
