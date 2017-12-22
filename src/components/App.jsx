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
      user: undefined,
      userLoggedIn: false,
      userProjects: [],
      projectCells: []
    };
    this.dataTables = {}
    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    var user;
    var userLoggedIn;
    var userProjects;
    helpers.storeFluxUser()
    .then(() => { return helpers.isLoggedIn() })
    .then((isLoggedIn) => {
      if (isLoggedIn) {
        user = helpers.getUser();
        userLoggedIn = true;
        return user.listProjects();
      } else {
        return Promise.resolve()
      }
    })
    .then((data) => {
      if (data !== undefined) {
        userProjects = data.entities;
        this.setState({user, userLoggedIn, userProjects});
        console.log(this.state);
      }
    })
  }

  handleLogin(event) {
    helpers.redirectToFluxLogin();
  }

  handleLogout(event) {
    helpers.logout();
    this.setState({userLoggedIn: false, user: undefined, userProjects: []});
  }

  handleProjectChange(event) {
    console.log('handleProjectChange');
    var filteredProjects = this.state.userProjects.filter((p) => { return p.id === event.target.value });
    if (filteredProjects.length > 0) {
      var selectedProject = filteredProjects[0];
      this.getCells(selectedProject)
      .then((data) => {
        this.setState({projectCells: data.entities});
      })
    }
  }

  getUser() {
    return this.state.user;
  }

  getDataTable(project) {
    if (!(project.id in this.dataTables)) {
      var user = this.getUser();
      if (user !== undefined) {
        var dt = user.getDataTable(project.id);
        this.dataTables[project.id] = { table: dt, handlers: {}, websocketOpen: false };
      } else {
        return {};
      }
    }
    return this.dataTables[project.id];
  }

  getCells(project) {
    return this.getDataTable(project).table.listCells();
  }

  render() {
    const userLoggedIn = this.state.userLoggedIn;
    console.log('render userLoggedIn', userLoggedIn);
    return (
      <div className='App'>
        { userLoggedIn ? (
          <div className='App'>
            <div id='header'>
              <div id='title'>
                <h1>FLUX</h1>
                <h2>Seed Project</h2>
              </div>
            <div id='actions'>
              <div className='select'>
                <select className='project' onChange={this.handleProjectChange}>
                  <option key='notselected' value='notselected'>Please select a project</option>
                  {this.state.userProjects.map((item) => {
                    return <option key={item.id} value={item.id}>{item.name}</option>
                  })}
                </select></div>
              <div id='logout'>
                <button onClick={this.handleLogout}>Logout</button>
              </div>
            </div>
          </div>
          <div id='viewport'><ViewPort/></div>
          <div className='select'>
            <select className='cell'>
              <option key='notselected' value='notselected'>Please select a cell</option>
              {this.state.projectCells.map((cell) => {
                return <option key={cell.id} value={cell.id}>{cell.label}</option>
              })}
            </select></div>
          </div>
        ) : (
          <div>
            <Login handleLogin={this.handleLogin} />
          </div>
        )}
      </div>
    );
  }
}

export default App;

