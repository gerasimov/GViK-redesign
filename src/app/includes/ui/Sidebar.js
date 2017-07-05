import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import ReactDOM from 'react-dom';
import store from './../../../store';
import './Sidebar.styl';
import {lastfm, vk, chrome} from './../mutations';

/**
 *
 */

let Sidebar = class extends PureComponent {
    static displayName = 'Sidebar';

    static propTypes = {
        lastfm: PropTypes.object,
        chrome: PropTypes.object,
    };

    /**
     *
     */
    componentDidMount() {
       // lastfm.setSession();
       // chrome.loadDownloadsList();
    }

    /**
     * @method render
     * @return {HTMLElement}
     */
    render() {
        const {chrome: {downloads}} = this.props;

        return null;
    }
};

//Sidebar = connect(
//    ({lastfm, chrome}) => ({lastfm, chrome}),
//)(Sidebar);

export default Sidebar;

const parent = document.createElement('div');
document.body.appendChild(parent);

ReactDOM.render(
    <Provider store={store}>
        <Sidebar />
    </Provider>,
    parent,
);
