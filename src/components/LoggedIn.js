import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import {  
    loggedIn,
} from '../redux';

class LoggedIn extends Component {
    constructor(props) {
        super(props);
        const user_identifier = props.match.params.user_identifier;
        console.log("LoggedIn user_identifier", user_identifier);
        this.props.loggedIn(user_identifier);
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
};

const AppContainer = connect(  
    mapStateToProps,
    mapDispatchToProps
)(LoggedIn);

export default AppContainer; 
