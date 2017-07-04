import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gotCharacters } from '../redux';

class Characters extends Component {
    componentWillMount() {
        setTimeout(() => {this.getCharacters()}, 1000);
    }

    getCharacters() {
        let gotCharacters = this.props.gotCharacters;
        this.props.ws.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            console.log("evt characters:", parsed_data);
            gotCharacters(parsed_data.characters);
        }
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
const mapDispatchToProps = {  
    gotCharacters,
};
const CharactersContainer = connect(  
    mapStateToProps,
    mapDispatchToProps,
)(Characters);

export default CharactersContainer;  
