const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({
      error: 'All fields are required!',
    });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username or password!',
      });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

const accountPage = (req, res) => res.render('account');

const passChange = async (req, res) => {
  const username = req.session.account.username;
  const pass = `${req.body.pass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!pass || !newPass || !newPass2) {
    return res.status(400).json({
      error: 'All fields are required!',
    });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({
      error: 'New passwords do not match!',
    });
  }

  return Account.authenticate(username, pass, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong password!',
      });
    }

    let doc;
    try {
      const hash = await Account.generateHash(newPass);
      doc = await Account.findOneAndUpdate(
        { username: username },
        { $set: { password: hash } },
        { new: true }).exec();
        
    } catch (err) {
      // If there is an error, log it and send the user an error message.
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    return res.status(204).json();
  });
}

const upgrade = async (req, res) => {
  const username = req.session.account.username;

  let doc;
  try {
    doc = await Account.findOneAndUpdate(
      { username: username },
      { $set: { premium: true } },
      { new: true }).exec();
      
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  return res.status(204).json();
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({
      error: 'All fields are required!',
    });
  }

  if (pass !== pass2) {
    return res.status(400).json({
      error: 'Passwords do not match!',
    });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();

    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/home' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Username already in use!',
      });
    }

    return res.status(500).json({
      error: 'An error occured!',
    });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  accountPage,
  passChange,
  upgrade,
};
