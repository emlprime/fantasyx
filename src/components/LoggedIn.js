import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import {  
    loggedIn,
    gotWebsocket,
    gotUserData,
} from '../redux';

class LoggedIn extends Component {
    constructor(props) {
        super(props);
        const user_identifier = props.match.params.user_identifier;
        console.log("LoggedIn user_identifier", user_identifier);
        this.props.loggedIn(user_identifier);
        this.ws = new WebSocket('ws://127.0.0.1:5000/test');
        this.props.gotWebsocket(this.ws);
        this.getUserData(user_identifier);
        console.log(this.props);
    }

    getUserData(user_identifier) {
        const gud = this.props.gotUserData;
        this.ws.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            console.log("evt got_user_data:", parsed_data);
            gud(parsed_data.user_data);
        }

        console.log("user_identifier:", this.props.user_identifier);
        const msg = JSON.stringify({type: 'user_data', user_identifier: user_identifier})
        this.ws.onopen = () => this.ws.send(msg);
    }
    
    render() {
        return (
            <Redirect to={{
            pathname: '/'
            }}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({  
});

const mapDispatchToProps = {  
    loggedIn,
    gotWebsocket,
    gotUserData,
};

const AppContainer = connect(  
    mapStateToProps,
    mapDispatchToProps
)(LoggedIn);

export default AppContainer; 
