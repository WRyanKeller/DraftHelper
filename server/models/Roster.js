const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const RosterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  budget: {
    type: Number,
    default: 0,
  },
  mons: {
    type: String,
    default: '',
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// based on code provided by Pr. Austin Willoughby and the RIT IGME Department
RosterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  mons: doc.mons,
});

const RosterModel = mongoose.model('Roster', RosterSchema);
module.exports = RosterModel;
