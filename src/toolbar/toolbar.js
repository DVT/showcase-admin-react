import React, { Component } from 'react';
import './toolbar.css';
import {Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle} from 'react-mdc-web';

class ShowcaseToolbar extends Component {
  render() {
    return (
      <div>
        <Toolbar className="ShowcaseToolbar">
          <ToolbarRow>
            <ToolbarSection align="start">
              <ToolbarTitle>DVT Showcase Admin</ToolbarTitle>
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
      </div>
    );
  }
}

export default ShowcaseToolbar;