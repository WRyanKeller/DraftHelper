const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// adds a specific pokemon to the roster
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

// removes a mon form the roster
const deleteMon = (e, name) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost('/deleteMon', {name}, loadMonList);

    return false;
};

// form for adding a pokemon to the roster
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

// displays the list of pokemon in the roster alongside
// their sprites and prices as well as the remaining budget
const MonList = props => {
    if (props.mons.length === 0) {
        return (
            <div className='monList'>
                <h3 id="budgetLeft">Budget Left: {props.budget}</h3>
            </div>
        );
    }

    const mons = props.mons.map(mon => {
        return (
            <div className='mon'>
                <img className='monSprite' src></img>
                <h3 className='monName'> Name: {mon.name} </h3>
                <h3 className='monPrice'> Price: {mon.price} </h3>
                <button className='monDelete' onClick={e => deleteMon(e, mon.name)}>X</button>
            </div>
        );
    });

    return (
        <div className="monList">
            {mons}
            <h3 id="budgetLeft">Budget Left: {props.budget}</h3>
        </div>
    );
};

const loadMonList = async () => {
    const response = await fetch('/getRoster');
    const data = await response.json();
    ReactDOM.render(
        <MonList mons={data.mons} budget={data.budget} />,
        document.getElementById('monList')
    );
};

const init = () => {
    /*ReactDOM.render(
        <RosterForm />,
        document.getElementById('newRoster')
    );*/
    
    ReactDOM.render(
        <MonList rosterList={[]} />,
        document.getElementById('monList')
    );

    loadMonList();
};

window.onload = init;