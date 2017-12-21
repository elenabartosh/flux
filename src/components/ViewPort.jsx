import React from 'react'
import { Button, Form } from 'semantic-ui-react'

class ViewPort extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initViewPort();
  }

  initViewPort() {
    var viewport = new window.FluxViewport(document.querySelector("#view"));
    console.log(viewport);
    viewport.setupDefaultLighting();
    viewport.setClearColor(0xffffff);
    var box_data = [
      { "dimensions": [1, 1, 6],
        "origin": [0, 0, 0],
        "primitive": "block",
        "units": {
          "dimensions": "meters",
          "origin": "meters"
        }
      }
    ];
    viewport.setGeometryEntity(box_data);
  }

  render() {
    console.log('render');
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


 
