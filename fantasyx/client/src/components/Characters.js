import React, { Component } from 'react';
import { connect } from 'react-redux';

const characterRowStyles = {
    height: '2em',
    listStyleType: 'none'
}
const characterNameStyles = {
    float: 'left'
}

const characterUserStyles = {
    float: 'right'
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
            Characters:
            <ul>
            {this.props.characters.map((character) => (
                <li id={`character${character.id}`} key={`character_${character.id}`} style={characterRowStyles}>
                <div style={characterNameStyles}>{character.name}</div>
                <div style={characterUserStyles}>{character.user}</div>
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
