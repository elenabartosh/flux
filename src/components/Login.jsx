import React from 'react'
import { Button, Form } from 'semantic-ui-react'

const Login = () => (
  <div className='Login'>
  <Form className='Login-form'>
    <Form.Field className='Login-field'>
      <label>Login</label>
      <Form.Input
        icon='user'
        iconPosition='left'
        placeholder='Login'/>
    </Form.Field>
    <Form.Field className='Login-field'>
      <label>Password</label>
      <Form.Input 
        icon='lock'
        iconPosition='left'
        placeholder='Password'
        type='password'/>
    </Form.Field>
    <Button id='loginbutton' type='submit'>Login</Button>
  </Form>
  </div>
)

export default Login

