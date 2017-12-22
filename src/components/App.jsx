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
      selectedProject: null,
      projectCells: [],
      selectedCell: null,
      projectData: null
    };
    this.dataTables = {}
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.handleCellChange = this.handleCellChange.bind(this);
  }

  resetState() {
    this.setState({
      user: undefined,
      userLoggedIn: false,
      userProjects: [],
      selectedProject: null,
      projectCells: [],
      selectedCell: null,
      projectData: null
    });
  }
  componentWillMount() {
    var user;
    var userLoggedIn;
    var userProjects;
    helpers.storeFluxUser()
    .then(() => { return helpers.isLoggedIn(); })
    .then((isLoggedIn) => {
      if (isLoggedIn) {
        user = helpers.getUser();
        userLoggedIn = true;
        return user.listProjects();
      } else {
        return Promise.resolve();
      }
    })
    .then((data) => {
      if (data !== undefined) {
        userProjects = data.entities;
        this.setState({user, userLoggedIn, userProjects});
      }
    })
    .catch((error) => {
      console.error('App.componentWillMount error', error);
    })
  }

  handleLogin(event) {
    helpers.redirectToFluxLogin();
  }

  handleLogout(event) {
    helpers.logout();
    this.resetState();
  }

  handleProjectChange(event) {
    var filteredProjects = this.state.userProjects.filter((p) => { return p.id === event.target.value; });
    if (filteredProjects.length > 0) {
      var selectedProject = filteredProjects[0];
      this.getCells(selectedProject)
      .then((data) => {
        this.setState({selectedProject: selectedProject, projectCells: data.entities, selectedCell: null, projectData: null});
      })
      .catch((error) => {
        console.error('App.handleProjectChange error', error);
      })
    } else {
      this.setState({selectedProject: null, projectCells: [], selectedCell: null, projectData: null});
    }
  }

  handleCellChange(event) {
    var filteredCells = this.state.projectCells.filter((c) => { return c.id === event.target.value; })
    if (filteredCells.length > 0) {
      var selectedCell = filteredCells[0];
      if (this.state.selectedProject && selectedCell) {
        this.getValue(this.state.selectedProject, selectedCell)
        .then((data) => {
          console.log('handleCellChange', data.value);
          var geometryData = this.getGeometryData(data.value);
          this.setState({selectedCell: selectedCell, projectData: geometryData});
        })
        .catch((error) => {
          console.error('App.handleCellChange error', error);
        })
      } else {
        this.setState({projectData: null});
      }
    } else {
      this.setState({selectedCell: null, projectData: null});
    }
  }

  getGeometryData(data) {
    var geometryData = [];
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].primitive === 'revitElement') {
          geometryData = geometryData.concat(data[i].geometryParameters.geometry);
        }
        else {
          geometryData = geometryData.concat(data[i]);
        }
      }
    } else {
      if (typeof data === 'object') {
        geometryData.push(data);
      }
    }
    return geometryData;
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

  getCell(project, cell) {
    return this.getDataTable(project).table.getCell(cell.id);
  }

  getValue(project, cell) {
    return this.getCell(project, cell).fetch();
  }

  render() {
    const userLoggedIn = this.state.userLoggedIn;
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
                </select>
              </div>
              <div className='select'>
                <select onChange={this.handleCellChange}>
                  <option key='notselected' value='notselected'>Please select a cell</option>
                  {this.state.projectCells.map((cell) => {
                  return <option key={cell.id} value={cell.id}>{cell.label}</option>
                })}
                </select>
              </div>
              <div>
                <button id='logout' type='submit' onClick={this.handleLogout}>Logout</button>
              </div>
            </div>
          </div>
          <div id='viewport'><ViewPort projectData={this.state.projectData}/></div>
          </div>
        ) : (
          <div className='Login'>
            <Login handleLogin={this.handleLogin} />
          </div>
        )}
      </div>
    );
  }
}

export default App;

