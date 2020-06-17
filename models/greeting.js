let mongoose = require('mongoose');

let greetingSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    rec:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: false
    },
    date:{
        type: String,
        required: true
    }
  });

let Greeting = module.exports = mongoose.model('Greeting',greetingSchema);