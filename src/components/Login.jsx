import React from 'react'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    this.props.handleLogin(event);
  }

  render() {
    return (
      <div>
        <button id='loginbutton' type='submit' onClick={this.handleLogin}>Login with Flux</button>
      </div>
    );
  }

}

export default Login;

