const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const createRoster = e => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#newName').value;
    const budget = e.target.querySelector('#newBudget').value;

    if (!name) {
        helper.handleError('Roster name is required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, budget}, loadRosterList);

    return false;
};

const deleteRoster = (e, name) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost('/deleteRoster', {name}, loadRosterList);

    return false;
};

const RosterForm = props => {
    return (
        <form id="rosterForm"
            name="rosterForm"
            onSubmit={createRoster}
            action="/createRoster"
            method="POST"
            className="rosterForm"
        >
            <label htmlFor='name'>Name: </label>
            <input id='newName' type='text' name='name' placeholder='Roster Name' />
            <label htmlFor='budget'>Budget: </label>
            <input id='newBudget' type='number' min='0' name='budget' />
            <input className='makeDomoSubmit' type='submit' value='Create Roster' />
        </form>
    )
};

// 
const RosterList = props => {
    if (props.rosterList.length === 0) {
        return (
            <div className='rosterList'>
                <h3 className='emptyList'>No Rosters Yet!</h3>
            </div>
        );
    }

    const rosters = props.rosterList.map(roster => {
        return (
            <div key={roster._id} className='roster'>
                <h3 className='rosterName'> Name: {roster.name} </h3>
                <button className='rosterDelete' onClick={e => deleteRoster(e, roster.name)}>X</button>
                <h3 className='rosterMons'>{roster.mons}</h3>
            </div>
        );
    });

    return (
        <div className="rosterList">
            {rosters}
        </div>
    );
};

const loadRosterList = async () => {
    const response = await fetch('/getRosterList');
    const data = await response.json();
    ReactDOM.render(
        <RosterList rosterList={data.rosterList} />,
        document.getElementById('rosterList')
    );
};

const init = () => {
    ReactDOM.render(
        <RosterForm />,
        document.getElementById('newRoster')
    );
    
    ReactDOM.render(
        <RosterList rosterList={[]} />,
        document.getElementById('rosterList')
    );

    loadRosterList();
};

window.onload = init;