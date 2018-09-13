const i18n = require('i18n');
const moment = require('moment');

const register = function (Handlebars) {
    const helpers = {
        __: function (req, res) {
            return i18n.__.apply(this, arguments);
        },
        __n: function (req, res) {
            return i18n.__n.apply(this, arguments);
        },
        ifCond: function (v1, operator, v2,options) {
            switch (operator){
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
        format_date: function(date, format) {
            moment.locale('vi');
            return moment(date).format(format);
        },
        limit_text: function (str) {
            if (str.length > 100)
                return str.substring(0,10) + '...';
            return str;
        },
        limit_url: function(url){
            if (url.length > 100)
                return url.substring(0,50) + '...';
            return url;
        },
        hide_show:function(hide){
            if(hide === '1'){
                return "Hiện";
            }else{
                return  'Ẩn';
            }
        },
        data_num: function (date_num) {
            var date_num = new Date(parseInt(date_num, 10)* 1000);
            return date_num
        }
    };


    if (Handlebars && typeof Handlebars.registerHelper === "function"){
        for (const prop in helpers){
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }
};
module.exports.register = register;
module.exports.helpers = register(null);