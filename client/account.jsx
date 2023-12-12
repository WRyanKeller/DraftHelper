const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handlePassChange = e => {
  e.preventDefault();
  helper.hideError();

  const pass = e.target.querySelector('#pass').value;
  const newPass = e.target.querySelector('#newPass').value;
  const newPass2 = e.target.querySelector('#newPass2').value;

  if (!pass || !newPass || !newPass2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if (newPass !== newPass2) {
    helper.handleError('New Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, {pass, newPass, newPass2}, {
    funct: helper.handleSuccess, params: { message: "Change successful!"}}
    );

  return false;
};

const PasswordForm = props => {
  return (
    <form id="passForm"
      name="passForm"
      onSubmit={handlePassChange}
      action="/passChange"
      method="POST"
      className="acctForm"
      >
      <h3>Change Password:</h3>
      <label htmlFor='pass'>Current Password: </label>
      <input id='pass' type='text' name='pass' placeholder='password' />
      <label htmlFor='newPass'>New Password: </label>
      <input id='newPass' type='password' name='newPass' placeholder='new password' />
      <label htmlFor='newPass2'>New Password (Confirm): </label>
      <input id='newPass2' type='password' name='newPass2' placeholder='retype new password' />
      <input className='formSubmit' type='submit' value='Change Password' />
    </form>
  );
};

const handleUpgrade = e => {
  helper.sendPost(e.target.action, {}, {
    funct: helper.handleSuccess, params: { message: "Upgrade successful!"}}
    );
};

// made to be a form in case it collects payment info in the future
const UpgradeButton = props => {
  return (
    <form id="upgradeForm"
      name="upgradeForm"
      onSubmit={handleUpgrade}
      action="/addPremium"
      method="POST"
      className="upgradeForm"
      >
      <h3>Upgrade to Premium:</h3>
      <input className='formSubmit' id='upgradeButton' type='submit' value='Click Here!' />
    </form>
  );
};

const init= () => {
  ReactDOM.render(<PasswordForm />,
    document.getElementById('passwordChange'));
    
  ReactDOM.render(<UpgradeButton />,
    document.getElementById('premium'));
};

window.onload = init;