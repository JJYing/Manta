// React
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionCreators from '../actions/settings.jsx';

// 3rd Party Libs
const _ = require('lodash');

// Components
import Info from '../components/settings/Info.jsx';
import AppSettings from '../components/settings/AppSettings.jsx';
import PrintOptions from '../components/settings/PrintOptions.jsx';

// Component
class Settings extends Component {
  componentWillMount = () => {
    this.setState({  visibleTab: 1  });
  }

  // Check if settings have been saved
  settingsSaved = () => {
    const {current, saved} = this.props.settings;
    return _.isEqual(current, saved);
  };

  // Save Settings to App Config
  saveSettingsState = () => {
    // Dispatch Action
    const {dispatch} = this.props;
    const saveSettings = bindActionCreators(
      ActionCreators.saveSettings,
      dispatch,
    );
    saveSettings(this.props.settings.current);
  };

  // Update Info Settings
  updateInfo = data => {
    const {dispatch} = this.props;
    const updateInfo = bindActionCreators(ActionCreators.updateInfo, dispatch);
    updateInfo(data);
  };

  // Update App Settings
  updateAppSettings = data => {
    const {dispatch} = this.props;
    const updateAppSettings = bindActionCreators(
      ActionCreators.updateAppSettings,
      dispatch,
    );
    updateAppSettings(data);
  };

  // Update Print Options
  updatePrintOptions = data => {
    const {dispatch} = this.props;
    const updatePrintOptions = bindActionCreators(
      ActionCreators.updatePrintOptions,
      dispatch,
    );
    updatePrintOptions(data);
  }

  // Switch Tab
  changeTab = tabNum => {
    this.setState({visibleTab: tabNum});
  };

  render = () => {
    const {info, appSettings, printOptions} = this.props.settings.current;
    return (
      <div className="pageWrapper">
        <div className="pageHeader">
          <h4>Settings</h4>
        </div>
        <div className="pageTabs">
          <a
            href="#"
            className={this.state.visibleTab === 1 ? 'active' : ''}
            onClick={() => this.changeTab(1)}>
            Profile
          </a>
          <a
            href="#"
            className={this.state.visibleTab === 2 ? 'active' : ''}
            onClick={() => this.changeTab(2)}>
            Print Options
          </a>
          <a
            href="#"
            className={this.state.visibleTab === 3 ? 'active' : ''}
            onClick={() => this.changeTab(3)}>
            App Settings
          </a>
        </div>
        <div className="pageContent">
          {this.state.visibleTab === 1 &&
            <Info info={info} updateInfo={this.updateInfo} />}
          {this.state.visibleTab === 2 &&
            <PrintOptions
              printOptions={printOptions}
              updatePrintOptions={this.updatePrintOptions} />}
          {this.state.visibleTab === 3 &&
            <AppSettings
              appSettings={appSettings}
              updateAppSettings={this.updateAppSettings}
            />}
        </div>
        {!this.settingsSaved() &&
          <div className="pageFooter">
            <small className="text-muted">You Have unsaved changes!</small>
            <a href="#" onClick={() => this.saveSettingsState()}>
              <i className="ion-android-checkmark-circle" />
            </a>
          </div>}
      </div>
    );
  };
}

// PropTypes Validation
Settings.propTypes = {
  settings: PropTypes.object.isRequired,
};

export default connect(state => ({
  settings: state.SettingsReducer,
}))(Settings);