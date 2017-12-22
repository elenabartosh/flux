import React from 'react'
import { Button, Form } from 'semantic-ui-react'
const FluxViewport = window.FluxViewport;

class ViewPort extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initViewPort(null);
  }

  componentDidUpdate() {
    this.initViewPort(this.props.projectData);
  }

  initViewPort(data) {
    var viewport = new FluxViewport(document.querySelector("#view"));
    viewport.setupDefaultLighting();
    viewport.setClearColor(0xffffff);
    if (FluxViewport.isKnownGeom(data)) {
      viewport.setGeometryEntity(data);
      console.log('isKnownGeom returns true', data);
    } else {
      viewport.setGeometryEntity(null);
      console.log('isKnownGeom returns false', data);
    }
  }

  render() {
    return (
      <div id='content'>
        <div className='column'>
          <div id='output'>
            <div className='label'>From Flux</div>
            <div id='geometry'>
              <div id='view'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewPort;
