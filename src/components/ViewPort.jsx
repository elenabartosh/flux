import React from 'react'
import scriptLoader from 'react-async-script-loader'
import { Button, Form } from 'semantic-ui-react'

class ViewPort extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      if (isScriptLoadSucceed) {
        console.log('componentWillReceiveProps', this.props);
        this.initViewPort();
      }
      else {
        console.log('Error');
      }
    }
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    if (isScriptLoaded && isScriptLoadSucceed) {
      console.log('componentDidMount', this.props);
      this.initViewPort();
    }
  }

  initViewPort() {
    var viewport = new window.FluxViewport(document.querySelector("#view"));
    // set up default lighting for the viewport
    viewport.setupDefaultLighting();
  }

  render() {
    return (
      <div className='ViewPort'>
      <div id='view'></div>
      </div>
    );
  }
}

export default scriptLoader(['https://unpkg.com/flux-viewport@0.8.0/dist/flux-viewport-bundle.global.js'])(ViewPort);


 
