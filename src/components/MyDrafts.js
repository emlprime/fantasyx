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

const releaseButtonStyles = {
    float: 'right',
    textAlign: 'right'
}

class MyDrafts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: []
        };
        
        this.getCharacters = this.getMyDrafts.bind(this);
        this.release       = this.release.bind(this);
    }
    
    componentWillMount() {
        this.getCharacters();
    }

    getMyDrafts() {
        api.server.get(`my_drafts/${this.props.user_data.user_identifier}`).then(response => {
            this.setState({ characters: response.data.characters });
        })
    }

    release(character_id) {
        api.server.post(`release/${this.props.user_data.user_identifier}`, {character_id}).then(response => {
            this.getCharacters();
        })
    }
    
    render() {
        return (
            <div>
            My Drafts:
            <ul>
            {this.state.characters.map((character) => (
                <li id={`character${character.id}`} key={`character_${character.id}`} style={draftRowStyles}>
                <div style={labelStyles}>{character.name}</div>
                <Button style={releaseButtonStyles} onClick={() => {this.release(character.id)}}>Release</Button>
                </li>
            ))}
            </ul>
                
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({  
    user_data: state.user_data,
});
const MyDraftsContainer = connect(  
    mapStateToProps
)(MyDrafts);

export default MyDraftsContainer;  
