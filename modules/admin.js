var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var adminSchema = new Schema({
    local: { // Use local
        email: String,
        password: String,
        adminPin: String
    },
    newsletter: Boolean, // True or false
    roles: String, //ADMIN, MOD, MEMBER, VIP
    status: String //ACTIVE, INACTIVE, SUSPENDED
});
//-----------------------khoi tao phuong thuc-------------------------
// Mã hóa mật khẩu
adminSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

// Giải mã mật khẩu
adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

// Valid pin code
adminSchema.methods.validPinCode = function(pincode) {
    return bcrypt.compareSync(pincode, this.local.adminPin);
}

//check Admin
adminSchema.methods.isGroupAdmin = function(checkRoles){
    if(checkRoles === 'ADMIN'){
        return true;
    }else {
        return false;
    }
};

adminSchema.methods.isInActivated = function(checkStatus){
    if(checkStatus === 'INACTIVE'){
        return true;
    }else {
        return false;
    }
};

adminSchema.methods.isSuspended = function(checkStatus){
    if(checkStatus === 'SUSPENDED'){
        return true;
    }else {
        return false;
    }
};

module.exports = mongoose.model('admin', adminSchema);
