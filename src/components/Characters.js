import React, { Component } from 'react';
import { connect } from 'react-redux';

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
                <li id={`character${character.id}`} key={`character_${character.id}`}>{character.name}</li>
            ))}
            </ul>
                
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => ({  
    characters: state.user_data.characters,
    ws: state.user_data.ws,
});

const CharactersContainer = connect(  
    mapStateToProps,
)(Characters);

export default CharactersContainer;  
