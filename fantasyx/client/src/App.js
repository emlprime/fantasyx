import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
}                       from 'react-router-dom'
import './App.css';
import Characters       from './components/Characters';
import MyDrafts         from './components/MyDrafts';
import Draft            from './components/Draft';
import Home             from './components/Home';
import Leaderboard      from './components/Leaderboard';
import { push as Menu } from 'react-burger-menu';
import { NotificationStack } from 'react-notification';
import queryString from 'query-string';

import {
    removeNotification,
    gotUserIdentifier,
} from './actions';

const menuStyles = {
    bmBurgerButton: {
        position: 'fixed', 
        width: '36px',
        height: '30px',
        left: '36px',
        top: '36px'
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenu: {
        background: '#373a47',
        padding: '1em 1em 0',
        fontSize: '2.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        padding: '0.8em'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}

const headerStyles = {
    color: '#c11d43',
    fontSize: '2.5em'
}

const subtitleStyles = {
    color: '#c11d43',
    fontSize: '.01em'

}

const pageWrapStyles = {
    width: '70%',
    margin: 'auto'
}

class App extends Component {
    constructor(props) {
        console.log("getting constructed app");
        super(props);
        const query_string = queryString.parse(global.location.search);
        const pathname = global.location.pathname;
        this.getUserData = this.getUserData.bind(this);
        console.log("pathname:", pathname);
        if (pathname.match(/\/user\//)) {
            const user_identifier = pathname.split("/")[2];
            console.log("got user identifier:", user_identifier);
            let getUserData = this.getUserData;
            this.props.ws.onopen = (evt) => {
                console.log("websocket on open. send user data");
                getUserData(user_identifier);
            }
            this.props.gotUserIdentifier(user_identifier);
        } else {
            console.log("no user identifier, we should log in");
            global.location.href = "http://lot.emlprime.com/api/login";
        }
    }

    getUserData(user_identifier) {
        const msg = JSON.stringify({type: 'user_data', user_identifier: user_identifier})
        console.log("this.props.ws.readystate:", this.props.ws.readyState);
        this.props.ws.send(msg);
    }
    
    render() {
        return (
             <Router>
                <div id="outer-container">
                
                <Menu styles={menuStyles} pageWrapId={`page-wrap`} outerContainerId={ "outer-container" }>
                <Link to="/">Home</Link>
                <Link to="/characters">Characters</Link>
                <Link to="/draft">Draft</Link>
                <Link to="/my_drafts">My Drafts</Link>
                <Link to="/leaderboard">Leaderboard</Link>
                </Menu>
                
                <main id="page-wrap" style={pageWrapStyles}>
                <h1 style={headerStyles}>aGoT</h1>
                <h2 style={subtitleStyles}>Crush your enemies. See them driven before you. Hear the lamentations of their women.</h2>
                <h3>Welcome {this.props.email}</h3>
                <Route exact path="/" component={Home}/>
                <Route exact path="/user/:user_identifier" component={Home}/>
                <Route path="/characters" component={Characters}/>
                <Route path="/draft" component={Draft}/>
                <Route path="/my_drafts" component={MyDrafts}/>
                <Route path="/leaderboard" component={Leaderboard}/>
                </main>
                
                <NotificationStack
            notifications={this.props.notifications}
            onDismiss={notification => this.props.removeNotification(notification)}
                />
                
            </div>
            </Router>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({  
    all: state,
    user_identifier: state.user_identifier,
    email: state.email,
    ws: state.ws,
    notifications: state.notifications,
});

const mapDispatchToProps = {  
    removeNotification,
    gotUserIdentifier,
};

const AppContainer = connect(  
    mapStateToProps,
    mapDispatchToProps,
)(App);

export default AppContainer;  
