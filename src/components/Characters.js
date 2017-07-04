import React, { Component } from 'react';

export default class Characters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: []
        };
        this.handleCharacters = this.handleCharacters.bind(this);
    }
    
    componentDidMount() {
        const socket = new WebSocket('ws://127.0.0.1:5000/test');
        let handleCharacters = this.handleCharacters;
        socket.onmessage = function(evt){
            handleCharacters(JSON.parse(evt.data));
        }
        const msg = JSON.stringify({type: 'characters'})
        socket.onopen = () => socket.send(msg);
    }

    handleCharacters(data) {
        this.setState({characters: data.characters});
    }

    componentWillUnmount() {
        if(this.ws) {
            this.ws.close();
        }
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
