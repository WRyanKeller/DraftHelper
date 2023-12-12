const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const addMon = e => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#newName').value;
    const budget = e.target.querySelector('#newPrice').value;

    if (!name) {
        helper.handleError('Pokemon name is required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, budget}, loadMonList);

    return false;
};

const deleteMon = (e, name) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost('/deleteMon', {name}, loadMonList);

    return false;
};

const RosterForm = props => {
    return (
        <form id="monForm"
            name="monForm"
            onSubmit={addMon}
            action="/addMon"
            method="POST"
            className="addForm"
        >
            <h3>New Roster:</h3>
            <label htmlFor='newName'>Name: </label>
            <input id='newName' type='text' name='newName' placeholder='Pokemon Name' />
            <label htmlFor='newPrice'>Price: </label>
            <input id='newPrice' type='number' min='0' name='newPrice' />
            <input className='addMonSubmit' type='submit' value='Add Pokemon' />
        </form>
    )
};

// 
const MonList = props => {
    if (props.rosterList.length === 0) {
        return (
            <div className='monList'>
            </div>
        );
    }

    const rosters = props.rosterList.map(mon => {
        return (
            <div className='mon'>
                <img className='monSprite' src></img>
                <h3 className='rosterName'> Name: {mon.name} </h3>
                <button className='rosterDelete' onClick={e => deleteMon(e, mon.name)}>X</button>
            </div>
        );
    });

    return (
        <div className="monList">
            {rosters}
        </div>
    );
};

const loadMonList = async () => {
    const response = await fetch('/getRosterList');
    const data = await response.json();
    ReactDOM.render(
        <MonList rosterList={data.rosterList} />,
        document.getElementById('rosterList')
    );
};

const init = () => {
    ReactDOM.render(
        <RosterForm />,
        document.getElementById('newRoster')
    );
    
    ReactDOM.render(
        <MonList rosterList={[]} />,
        document.getElementById('rosterList')
    );

    loadMonList();
};

window.onload = init;