import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import {  
    loggedIn,
    gotWebsocket,
    gotUserData,
} from '../redux';
import queryString from 'query-string';

class LoggedIn extends Component {
    constructor(props) {
        super(props);
        const parsed = queryString.parse(global.location.search);

        this.state = {
            user_identifier: props.match.params.user_identifier,
            redirect_to: parsed.redirect_to,
        };
    }

    componentWillMount() {
        console.log("LoggedIn user_identifier", this.state.user_identifier);
        this.props.loggedIn(this.state.user_identifier);
        this.ws = new WebSocket('ws://127.0.0.1:5000/test');
        this.props.gotWebsocket(this.ws);
        this.getUserData(this.state.user_identifier);
    }

    getUserData(user_identifier) {
        const gud = this.props.gotUserData;
        this.ws.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            gud(parsed_data.user_data);
        }

        const msg = JSON.stringify({type: 'user_data', user_identifier: user_identifier})
        this.ws.onopen = () => this.ws.send(msg);
    }
    
    render() {
        return (
            <Redirect to={{
            pathname: this.state.redirect_to || '/draft'
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
