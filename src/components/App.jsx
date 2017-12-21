import React, { Component } from 'react';
import Login from '../components/Login.jsx';
import ViewPort from '../components/ViewPort.jsx';
import Config from '../config/config.js';
import FluxSdk from 'flux-sdk-browser';
import FluxHelpers from 'flux-sdk-helpers';

var sdk = new FluxSdk(Config.flux_client_id, { redirectUri: Config.url, fluxUrl: Config.flux_url });
var helpers = new FluxHelpers(sdk);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    helpers.storeFluxUser()
    .then(() => { return helpers.isLoggedIn() })
    .then((isLoggedIn) => {
      if (isLoggedIn) {
        console.log('helpers.isLoggedIn() returns true');
        this.setState({userLoggedIn: true});
      } else {
        console.log('helpers.isLoggedIn() returns false');
      }
    })
  }

  handleLogin(event) {
    helpers.redirectToFluxLogin();
  }

  handleLogout(event) {
    helpers.logout();
    this.setState({userLoggedIn: false});
  }

  render() {
    const userLoggedIn = this.state.userLoggedIn;
    console.log('render userLoggedIn', userLoggedIn);
    return (<div className='App'>{userLoggedIn ? (
              <div className='App'>
                <div id='header'>
                  <div id='title'>
                    <h1>FLUX</h1>
                    <h2>Seed Project</h2>
                  </div>
                <div id='actions'>
                  <button id='logout' onClick={this.handleLogout}>Logout</button>
                </div>
              </div>
              <div id='viewport'><ViewPort/></div>
            </div>
          ) : (
            <div><Login handleLogin={this.handleLogin} /></div>
        )}
        </div>
    );
  }
}


export default App;

