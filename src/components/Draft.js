import React, { Component } from 'react';
import { connect } from 'react-redux';
import api from '../services';
import Button from './Button';

const labelStyles = {
    width: '15em',
    float: 'left',
    marginTop: '.9em'
}

const draftRowStyles = {
    listStyleType: 'none'
}

const draftButtonStyles = {
    float: 'right',
    textAlign: 'right'
}

class Draft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: []
        };
        console.log(this.props);
        this.getCharacters = this.getAvailableCharacters.bind(this);
        this.draft = this.draft.bind(this);
    }
    
    componentWillMount() {
        this.getCharacters();
    }

    getAvailableCharacters() {
        api.server.get(`available_characters`).then(response => {
            this.setState({ characters: response.data.characters });
        })
    }

    draft(character_id) {
        api.server.post(`draft/${this.props.user_data.user_identifier}`, {character_id}).then(response => {
            this.getCharacters();
        })
    }
    
    render() {
        return (
            <div>
            Draft for {this.props.email}:
            <ul>
            {this.state.characters.map((character) => (
                <li id={`character${character.id}`} key={`character_${character.id}`} style={draftRowStyles}>
                <div style={labelStyles}>{character.name}</div>
                <Button style={draftButtonStyles} onClick={() => {this.draft(character.id)}}>Draft</Button>
                </li>
            ))}
            </ul>
                
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({  
    user_data: state.user_data,
    email: state.email,
});
const DraftContainer = connect(  
    mapStateToProps
)(Draft);

export default DraftContainer;  
