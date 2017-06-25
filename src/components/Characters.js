import React, { Component } from 'react';
import api from '../services';


export default class Characters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: []
        };
        this.getCharacters = this.getCharacters.bind(this);
    }
    
    componentWillMount() {
        this.getCharacters();
    }

    getCharacters() {
        api.server.get(`characters`).then(response => {
            this.setState({ characters: response.data.characters });
        })
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
