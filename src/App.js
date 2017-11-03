import React, { Component } from 'react';
import './App.css';
import {Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle} from 'react-mdc-web';
import ViewApps from './view-apps/view-apps';
import Login from './login/login';

class App extends Component {

  render() {
    return (
      <div>
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection align="start">
              <ToolbarTitle>DVT Showcase Admin</ToolbarTitle>
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
        <Login/>
      </div>
    );
  }
}

export default App;