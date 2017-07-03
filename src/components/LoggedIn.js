import React, { Component } from 'react';
import { connect } from 'react-redux';
import api from '../services';
import {Redirect} from 'react-router-dom';
import {  
    loggedIn,
    gotUserData,
} from '../redux';

class LoggedIn extends Component {
    constructor(props) {
        super(props);
        const user_identifier = props.match.params.user_identifier;
        console.log("LoggedIn user_identifier", user_identifier);
        this.getUserData = this.getUserData.bind(this);
        this.props.loggedIn(user_identifier);
        this.getUserData(user_identifier);
    }

    getUserData(user_identifier) {
        console.log("get user data");
        api.server.get(`user/${user_identifier}`).then(response => {
            console.log(response.data);
            this.props.gotUserData(response.data)
        })
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
    user_identifier: state.user_identifier,
});

const mapDispatchToProps = {  
    loggedIn,
    gotUserData,
};

const AppContainer = connect(  
    mapStateToProps,
    mapDispatchToProps
)(LoggedIn);

export default AppContainer; 
