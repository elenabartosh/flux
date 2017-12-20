import React, { Component } from 'react';
import Login from '../components/Login.jsx';
import ViewPort from '../components/ViewPort.jsx';
import Config from '../config/config.js';
import FluxSdk from 'flux-sdk-node';
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

  isUserLoggedIn() {
    return window.location.search.search(/flux_token/) !== -1
  }

  componentWillMount() {
    // helpers.isLoggedIn()
    // .then((results) => {console.log(results)});
    if (this.isUserLoggedIn()) {
      this.setState({userLoggedIn: true});
    }
  }

  handleLogin(event) {
    helpers.login();
  }

  handleLogout(event) {
    helpers.logout();
  }

  render() {
    const userLoggedIn = this.state.userLoggedIn;
    return (
      <div className='App'>
        <div>
          {userLoggedIn ? (
            <div>
              <button onClick={this.handleLogout}>Logout</button>
              <ViewPort/>
            </div>

          ) : (
            <Login handleLogin={this.handleLogin} />
        )}
        </div>
      </div>
    );
  }
}

export default App;

