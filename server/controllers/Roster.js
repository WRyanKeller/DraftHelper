// based on code provided by Pr. Austin Willoughby and the RIT IGME Department

const models = require('../models');

const { Roster } = models;

const appPage = async (req, res) => res.render('app');

const getNumOfRosters = async (query) => {
  try {
    const docs = await Roster.find(query).select('name').lean().exec();

    return docs.length;
  } catch (err) {
    console.log(err);
    return -1;
  }
};

// creates a roster of a given unique name
const createRoster = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: 'Rosters need a name!',
    });
  }

  const rosterData = {
    name: req.body.name,
    budget: req.body.budget ? req.body.budget : 0,
    mons: '',
    owner: req.session.account._id,
  };

  try {
    const query = { owner: req.session.account._id };

    // checks for number of rosters under id
    const isPremium = await models.Account.checkPremium(query.owner);
    const numRosters = await getNumOfRosters(query);

    if (numRosters >= (isPremium ? 10 : 5)) {
      const e = new Error('manual throw to prevent overloading roster num');
      e.code = isPremium ? 12001 : 12000;
      throw e;
    }

    // rules out roster names which have been used before
    const doc = await Roster.findOne({ name: req.body.name }).exec();
    if (doc) {
      const e = new Error('manual throw to prevent duplicate roster names');
      e.code = 11000;
      throw e;
    }

    // this only throws that same error is name, budget, and mons all match
    const newRoster = new Roster(rosterData);
    await newRoster.save();
    return res.status(201).json({
      name: newRoster.name,
      budget: newRoster.budget,
      mons: newRoster.mons,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Roster  already exists!',
      });
    }

    if (err.code === 12000) {
      return res.status(400).json({
        error: 'Upgrade to premium to store up to ten rosters!',
      });
    }

    if (err.code === 12001) {
      return res.status(400).json({
        error: 'Can only store up to ten rosters!',
      });
    }

    return res.status(500).json({
      error: 'An error occured creating Roster!',
    });
  }
};

// retreives all rosters of the given user
const getRosterList = async (req, res) => {
  try {
    const query = {
      owner: req.session.account._id,
    };
    const docs = await Roster.find(query).select('name budget mons').lean().exec();

    return res.json({ rosterList: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Error retreiving roster list!',
    });
  }
};

// Deletes a roster by name and owner
const deleteRoster = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: 'A roster name is required to delete!',
    });
  }

  let doc;
  try {
    doc = await Roster.findOneAndDelete(
      {
        name: req.body.name,
        owner: req.session.account._id,
      },
      {},
    ).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'Roster not Found!' });
  }

  // Otherwise, we got a result and will send "Updated (No Content)" to the user.
  return res.status(204).json();
};

module.exports = {
  appPage,
  createRoster,
  getRosterList,
  deleteRoster,
};
