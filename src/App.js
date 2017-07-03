import React            from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
}                       from 'react-router-dom'
import './App.css';
import Characters       from './components/Characters';
import MyDrafts         from './components/MyDrafts';
import Draft            from './components/Draft';
import Home             from './components/Home';
import LoggedIn         from './components/LoggedIn';
import { push as Menu } from 'react-burger-menu';

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
const App = () => (
    <Router>
    <div id="outer-container">
    <Menu styles={menuStyles} pageWrapId={`page-wrap`} outerContainerId={ "outer-container" }>
    <Link to="/">Home</Link>
    <Link to="/characters">Characters</Link>
    <Link to="/draft">Draft</Link>
    <Link to="/my_drafts">My Drafts</Link>
    </Menu>
    <main id="page-wrap" style={pageWrapStyles}>
    <h1 style={headerStyles}>aGoT</h1>
    <h2 style={subtitleStyles}>Crush your enemies. See them driven before you. Hear the lamentations of their women.</h2>
    <Route path="/user/:user_identifier" component={LoggedIn}/>
    <Route exact path="/" component={Home}/>
    <Route path="/characters" component={Characters}/>
    <Route path="/draft" component={Draft}/>
    <Route path="/my_drafts" component={MyDrafts}/>
    </main>
    </div>
    </Router>
)

export default App;

