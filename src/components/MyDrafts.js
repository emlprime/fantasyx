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
        let gotMyDrafts = this.props.gotMyDrafts;
        this.props.ws.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            console.log("evt my_drafts:", parsed_data);
            gotMyDrafts(parsed_data.my_drafts);
        }
        const msg = JSON.stringify({type: 'my_drafts', user_identifier: this.props.user_identifier})

        this.props.ws.send(msg);
    }
    
    release(character_id) {
        let gotMyDrafts = this.props.gotMyDrafts;

        this.props.ws.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            console.log("evt release:", parsed_data);
            gotMyDrafts(parsed_data.my_drafts);
        }

        console.log("user_identifier:", this.props);
        const msg = JSON.stringify({type: 'release', user_identifier: this.props.user_identifier, character_id: character_id})
        this.props.ws.send(msg);

        
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
    ws: state.user_data.ws,
});
const mapDispatchToProps = {  
    gotMyDrafts,
};
const MyDraftContainer = connect(  
    mapStateToProps,
    mapDispatchToProps
)(MyDraft);

export default MyDraftContainer;  
