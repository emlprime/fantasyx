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
import LoggedIn         from './components/LoggedIn';
import Leaderboard      from './components/Leaderboard';
import { push as Menu } from 'react-burger-menu';

import { NotificationStack } from 'react-notification';

import { removeNotification } from './redux';

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
    render() {
        let content = '';
        
        if(!this.props.ws || !this.props.ws.url) {
            const redirect_to = global.location.pathname.split('?')[0];
            console.log("no websocket, we should redirect to login and then to:", redirect_to);
            content = (
                <Router>
                <div id="outer-container">
                <main id="page-wrap" style={pageWrapStyles}>
                <Route path="/user/:user_identifier" component={LoggedIn}/>
                <Route exact path="/" component={Home}/>
                </main>
                <Redirect to={{
                    pathname: `/user/${this.props.user_identifier}/?redirect_to=${redirect_to}`
                }}/>
                </div>
                </Router>
            );
        } else {
            console.log("websocket found! yay", this.props.ws.url);
            content = (
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
                <Route path="/user/:user_identifier" component={LoggedIn}/>
                <Route exact path="/" component={Home}/>
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
            )
        }
        return content;
    }
}

const mapStateToProps = (state, ownProps) => ({  
    user_identifier: state.user_data.user_identifier,
    email: state.user_data.email,
    ws: state.user_data.ws,
    notifications: state.user_data.notifications,
});

const mapDispatchToProps = {  
    removeNotification,
};

const AppContainer = connect(  
    mapStateToProps,
    mapDispatchToProps,
)(App);

export default AppContainer;  
