import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    color: 'black',
    fontWeight: 'bold',
    outline: '1px solid black',
}

const disabledDraftButtonStyles = {
    color: '#DDD',
}

class Draft extends Component {
    constructor(props) {
        super(props);
        this.draftButton = this.draftButton.bind(this);
    }
    componentWillMount() {
        setTimeout(() => {this.getAvailableCharacters()}, 100);
    }

    getAvailableCharacters() {
        const msg = JSON.stringify({type: 'available_characters', user_identifier: this.props.user_identifier})
        this.props.ws.send(msg);
    }

    draft(character_id) {
        const msg = JSON.stringify({type: 'draft', user_identifier: this.props.user_identifier, character_id: character_id})
        this.props.ws.send(msg);
    }
    
    draftButton(can_draft, character_id) {
        if (this.props.can_draft) {
            return (
                <Button style={draftButtonStyles} onClick={() => {this.draft(character_id)}}>Draft</Button>
            );
        } else {
            return (
                <Button style={disabledDraftButtonStyles} disabled={true}>Draft</Button>
            );
        }

    }
    render() {
        return (
            <div>
            Draft for {this.props.email}:
            <ul>
            {this.props.available_characters.map((character) => (
                <li id={`character${character.id}`} key={`character_${character.id}`} style={draftRowStyles}>
                <div style={labelStyles}>{character.name}</div>
                {this.draftButton(this.props.can_draft, character.id)}
                </li>
            ))}
            </ul>
                
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({  
    user_identifier: state.user_data.user_identifier,
    email: state.user_data.email,
    available_characters: state.user_data.available_characters,
    ws: state.user_data.ws,
    can_draft: state.user_data.can_draft,
});
const DraftContainer = connect(  
    mapStateToProps,
)(Draft);

export default DraftContainer;  
