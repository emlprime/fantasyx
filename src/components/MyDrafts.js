import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from './Button';
import {  
    gotMyDrafts,
} from '../redux';

const labelStyles = {
    width: '15em',
    float: 'left',
    marginTop: '.9em'
}

const releaseRowStyles = {
    listStyleType: 'none'
}

const releaseButtonStyles = {
    float: 'right',
    textAlign: 'right'
}

class MyDraft extends Component {
    componentDidMount() {
        this.getMyDrafts();
    }

    getMyDrafts() {
        console.log("in my draft", this.props);
        const socket = new WebSocket('ws://127.0.0.1:5000/test');
        let gotMyDrafts = this.props.gotMyDrafts;
        socket.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            console.log("evt my_drafts:", parsed_data);
            gotMyDrafts(parsed_data.my_drafts);
        }
        const msg = JSON.stringify({type: 'my_drafts', user_identifier: this.props.user_identifier})

        socket.onopen = () => socket.send(msg);
    }

    componentWillUnmount() {
        if(this.ws) {
            this.ws.close()
        }
    }
    
    release(character_id) {
        console.log("character_id:", character_id);
        const socket = new WebSocket('ws://127.0.0.1:5000/test');
        let gotMyDrafts = this.props.gotMyDrafts;

        socket.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            console.log("evt release:", parsed_data);
            gotMyDrafts(parsed_data.my_drafts);
        }

        console.log("user_identifier:", this.props);
        const msg = JSON.stringify({type: 'release', user_identifier: this.props.user_identifier, character_id: character_id})
        socket.onopen = () => socket.send(msg);

        
    }
    
    render() {
        const characters =  this.props.my_drafts || [];
        return (
            <div>
            MyDraft for {this.props.email}:
            <ul>
            {characters.map((character) => (
                <li id={`character${character.id}`} key={`character_${character.id}`} style={releaseRowStyles}>
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
    user_identifier: state.user_data.user_identifier,
    email: state.user_data.email,
    my_drafts: state.user_data.my_drafts,
});
const mapDispatchToProps = {  
    gotMyDrafts,
};
const MyDraftContainer = connect(  
    mapStateToProps,
    mapDispatchToProps
)(MyDraft);

export default MyDraftContainer;  
