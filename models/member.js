const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//definiera strukturen av dokumentet
const memberSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  number: {
    type: String,
    required: true
  },
  favouriteAuthor: {
    type: String,
    required: true
  }
}, {timestamps: true });


//gör modell baserat på schemat ovanför
const Member = mongoose.model('Member', memberSchema);


module.exports = Member;