// Libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as FormActionCreators from '../../actions/form.jsx';
import * as ContactsActionCreators from '../../actions/contacts.jsx';

// 3rd Party Libs
import _ from 'lodash';

// Custom Components
import RecipientForm from './RecipientForm.jsx';
import RecipientsList from './RecipientsList.jsx';

// Component
class Recipient extends Component {
  // Extract data from redux set as state before mount
  componentWillMount = () => {
    // Retrieve all contacts
    if (!this.props.recipients.loaded) {
      const {dispatch} = this.props;
      const getAllContacts = bindActionCreators(
        ContactsActionCreators.getAllContacts,
        dispatch
      );
      getAllContacts();
    }
    // Set state
    const {recipient} = this.props.currentInvoice;
    this.setState({
      newRecipient: recipient.newRecipient ? true : false,
      new: _.isEmpty(recipient.new) ? {} : recipient.new,
      select: _.isEmpty(recipient.select) ? {} : recipient.select,
    });
  };

  // Clear Form When Props are Empty Objects
  componentWillReceiveProps = nextProps => {
    const { recipient } = nextProps.currentInvoice;
    if (_.isEmpty(recipient.new) && _.isEmpty(recipient.select)) {
      this.setState({
        newRecipient: true,
        new: {},
        select: {},
      });
    }
  }

  // Toggle Recipient Form
  toggleForm = event => {
    this.setState({ newRecipient: event.target.value === 'new' ? true : false }, () => {
      this.dispatchRecipientData(this.state);
    });
  };

  //  Handle Recipient Form Input Change
  handleRecipientFormInputChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      new: Object.assign({}, this.state.new, {
        [name]: value
      })
    }, () => {
      this.dispatchRecipientData(this.state);
    });
  }

  // Handle Recipient Selection Change
  handleRecipientSelectChange = selectedRecipient => {
    this.setState({
      select: selectedRecipient,
    }, () => {
      this.dispatchRecipientData(this.state);
    });
  }

  // Send Recipient State Data to Store
  dispatchRecipientData = data => {
    const {dispatch} = this.props;
    const dispatchRecipientData = bindActionCreators(
      FormActionCreators.updateRecipient,
      dispatch,
    );
    dispatchRecipientData(data);
  };

  // Output Form or List
  outputComponent = () => {
    // If No contact existed, show the contact form
    const { recipients } = this.props;
    if (recipients.data.length === 0) {
      return (
        <RecipientForm
          currentRecipientData={this.state.new}
          handleRecipientFormInputChange={this.handleRecipientFormInputChange}
        />
      );
    }
    // If there are contacts
    // Show New or Select Form depends on state
    if (this.state.newRecipient) {
      return (
        <RecipientForm
          currentRecipientData={this.state.new}
          handleRecipientFormInputChange={this.handleRecipientFormInputChange}
        />
      );
    } else {
      return (
        <RecipientsList
          recipients={recipients.data}
          currentSelectedRecipient={this.state.select}
          handleRecipientSelectChange={this.handleRecipientSelectChange}
        />
      );
    }
  };

  // Render
  render = () => {
    const {recipients} = this.props;
    const {newRecipient} = this.state;
    return (
      <div className="formSection">
        <label className="itemLabel">Recipient</label>
        {this.outputComponent()}
        {recipients.data.length > 0 &&
          <div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  onChange={e => this.toggleForm(e)}
                  checked={newRecipient === true}
                  value="new"
                />
                Add New
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  onChange={e => this.toggleForm(e)}
                  checked={newRecipient === false}
                  value="select"
                />
                Select
              </label>
            </div>
          </div>}
      </div>
    );
  };
}

// PropTypes Validation
Recipient.propTypes = {
  currentInvoice: PropTypes.object.isRequired,
  recipients: PropTypes.object.isRequired,
};

export default connect(state => ({
  currentInvoice: state.FormReducer,
  recipients: state.ContactsReducer,
}))(Recipient);