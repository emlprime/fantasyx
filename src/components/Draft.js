import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from './Button';
import {  
    gotAvailableCharacters,
} from '../redux';

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
    componentDidMount() {
        console.log(this.props.ws);
        this.getAvailableCharacters();
    }

    getAvailableCharacters() {
        let gotCharacters = this.props.gotAvailableCharacters;
        this.props.ws.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            console.log("evt available_characters:", parsed_data);
            gotCharacters(parsed_data.available_characters);
        }
        console.log("user_identifier:", this.props);
        const msg = JSON.stringify({type: 'available_characters', user_identifier: this.props.user_identifier})
        this.props.ws.send(msg);

    }

    componentWillUnmount() {
        if(this.ws) {
            this.ws.close()
        }
    }
    
    draft(character_id) {
        let gotCharacters = this.props.gotAvailableCharacters;

        this.props.ws.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            console.log("evt draft:", parsed_data);
            gotCharacters(parsed_data.available_characters);
        }

        const msg = JSON.stringify({type: 'draft', user_identifier: this.props.user_identifier, character_id: character_id})
        this.props.ws.send(msg);

        
    }
    
    render() {
        return (
            <div>
            Draft for {this.props.email}:
            <ul>
            {this.props.available_characters.map((character) => (
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
    user_identifier: state.user_data.user_identifier,
    email: state.user_data.email,
    available_characters: state.user_data.available_characters,
    ws: state.user_data.ws,
});
const mapDispatchToProps = {  
    gotAvailableCharacters,
};
const DraftContainer = connect(  
    mapStateToProps,
    mapDispatchToProps
)(Draft);

export default DraftContainer;  
