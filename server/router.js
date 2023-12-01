const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/home', mid.requiresLogin, controllers.Roster.appPage);

  app.get('/getRosterList', mid.requiresLogin, controllers.Roster.getRosterList);
  app.post('/createRoster', mid.requiresLogin, controllers.Roster.createRoster);
  app.post('/deleteRoster', mid.requiresLogin, controllers.Roster.deleteRoster);

  app.get('/', mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
