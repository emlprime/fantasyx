import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import {  
    loggedIn,
    gotMsg,
    gotWebsocket,
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
        this.props.loggedIn(this.state.user_identifier);
        this.ws = new WebSocket('ws://lot.emlprime.com:5000/test');
        this.ws.onmessage = function(evt){
            const parsed_data = JSON.parse(evt.data)
            gotMsg(parsed_data);
        }
        this.getUserData(this.state.user_identifier);
        this.props.gotWebsocket(this.ws);
    }

    getUserData(user_identifier) {
        console.log("do we have a user identifier: ", user_identifier);
        if(user_identifier !== 'undefined') {
            console.log("we have a user identifier");
            console.log(typeof user_identifier);
            console.log("PDS user identifier:", user_identifier);
            const msg = JSON.stringify({type: 'user_data', user_identifier: user_identifier})
            this.ws.onopen = () => this.ws.send(msg);
        } else {
            const msg = JSON.stringify({type: 'user_data', user_identifier: this.props.user_identifier})
            this.ws.onopen = () => this.ws.send(msg);
            console.log("we don't have a user identifier");
        }
    }
    
    render() {
        const redirect_to = (this.state.redirect_to && !this.state.redirect_to.match(/user/)) ? this.state.redirect_to : '/';
        return (
            <Redirect to={{
            pathname: redirect_to
            }}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({  
    user_identifier: state.user_data.user_identifier    
});

const mapDispatchToProps = {  
    loggedIn,
    gotMsg,
    gotWebsocket,
};

const AppContainer = connect(  
    mapStateToProps,
    mapDispatchToProps
)(LoggedIn);

export default AppContainer; 
