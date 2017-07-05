import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from './Button';

const labelStyles = {
    width: '15em',
    float: 'left',
    marginTop: '.9em'
}

const releaseRowStyles = {
    listStyleType: 'none',
    width: '30em',
    float: 'left',
}

const releaseButtonStyles = {
    float: 'right',
    textAlign: 'right'
}

class MyDraft extends Component {
    componentWillMount() {
        setTimeout(() => {this.getMyDrafts()}, 100);
    }

    getMyDrafts() {
        const msg = JSON.stringify({type: 'my_drafts', user_identifier: this.props.user_identifier})
        console.log("my drafts props", this.props.ws, msg);
        this.props.ws.send(msg);
    }
    
    release(character_id) {
        const msg = JSON.stringify({type: 'release', user_identifier: this.props.user_identifier, character_id: character_id})
        this.props.ws.send(msg);
    }
    
    render() {
        console.log("rendering mydrafts", this.props.my_drafts);
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
const MyDraftContainer = connect(  
    mapStateToProps,
)(MyDraft);

export default MyDraftContainer;  
