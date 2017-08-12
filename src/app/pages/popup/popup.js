import React, { Component } from "react";
import { render } from "react-dom";

class Test extends Component {
  /**
   * 
   */

  state = { id: null };

  /**
   * 
   */
  componentDidMount() {
    window.chrome.runtime.getBackgroundPage(async bg => {
      bg.gvik.channel
        .sendToInclude({
          handler: "getVKID"
        })
        .then(id => this.setState({ id }));
    });
  }

  /**
   * 
   */
  render() {
    return (
      <div>
        {this.state.id}
      </div>
    );
  }
}

render(<Test />, document.getElementById("root"));
