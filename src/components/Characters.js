import React, { Component } from 'react';
import { connect } from 'react-redux';

class Characters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: []
        };
        this.handleCharacters = this.handleCharacters.bind(this);
    }
    
    componentDidMount() {
        const socket = this.props.ws;
        let handleCharacters = this.handleCharacters;
        socket.onmessage = function(evt){
            handleCharacters(JSON.parse(evt.data));
        }
        const msg = JSON.stringify({type: 'characters'})
        socket.send(msg);
    }

    handleCharacters(data) {
        this.setState({characters: data.characters});
    }

    render() {
        return (
            <div>
            Characters:
            <ul>
            {this.state.characters.map((character) => (
                <li id={`character${character.id}`} key={`character_${character.id}`}>{character.name}</li>
            ))}
            </ul>
                
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => ({  
    ws: state.user_data.ws,
});
const CharactersContainer = connect(  
    mapStateToProps,
)(Characters);

export default CharactersContainer;  
