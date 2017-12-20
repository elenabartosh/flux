import React from 'react'
import { Button, Form } from 'semantic-ui-react'

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
      <div className='Login'>
      <Form className='Login-form'>
        <Button id='loginbutton' type='submit' onClick={this.handleLogin}>Login with Flux</Button>
      </Form>
      </div>
    );
  }

}

export default Login;

