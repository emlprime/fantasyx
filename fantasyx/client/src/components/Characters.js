import React, { Component } from 'react';
import { connect } from 'react-redux';

const characterRowStyles = {
    listStyleType: 'none',
    padding: '.4em 1em',
}

const characterStyles = {

}
const characterNameStyles = {
    width: '60%',
}

const characterDescriptionStyles = {

}

const characterOwnerStyles = {
    width: '30%',
    float: 'right',
    padding: '0.3em',
    textShadow: '2px 2px 2px #666',
}

const characterClearStyles = {
    clear: 'both'
}


class Characters extends Component {
    componentWillMount() {
        setTimeout(() => {this.getCharacters()}, 100);
    }

    getCharacters() {
        const msg = JSON.stringify({type: 'characters'})
        this.props.ws.send(msg);
    }
    
    render() {
        return (
            <div>
            <ul id="characters">
            {this.props.characters.map((character) => (
                <li id={`character${character.id}`} key={`character_${character.id}`} style={characterRowStyles}>
                <div style={characterStyles}>
                <div style={characterOwnerStyles}>{character.user}</div>
                <h2 style={characterNameStyles}>{character.name}</h2>
                <h3 style={characterDescriptionStyles}>{character.description}</h3>
                <div style={characterClearStyles}>&nbsp;</div>
                </div>
                </li>
            ))}
            </ul>
                
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => ({  
    characters: state.characters,
    ws: state.ws,
});

const CharactersContainer = connect(  
    mapStateToProps,
)(Characters);

export default CharactersContainer;  
