import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Provider, connect } from "react-redux";
import ReactDOM from "react-dom";
import store from "./../../../store";
import "./Sidebar.styl";
import { lastfm, vk } from "./../mutations";
import isEqual from "lodash/fp/isEqual";
/**
 * 
 */

let Sidebar = class extends PureComponent {
  static displayName = "Sidebar";

  static propTypes = {
    lastfm: PropTypes.object
  };

  /**
 * 
 */
  componentDidMount() {
    lastfm.setSession();
  }

  /**
   * @method render
   * @return {HTMLElement}
  */
  render() {
    const { lastfm: { session } = {} } = this.props;

    return session
      ? <div className="gvik-sidebar">
          {Object.keys(session).map(key => {
            return (
              <div key={key}>
                {key} = {JSON.stringify(session[key])}
              </div>
            );
          })}
        </div>
      : <span>Loading...</span>;
  }
};

Sidebar = connect(({ lastfm }) => ({ lastfm }))(Sidebar);
export default Sidebar;

const parent = document.createElement("div");
document.body.appendChild(parent);

ReactDOM.render(
  <Provider store={store}>
    <Sidebar />
  </Provider>,
  parent
);
