import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { summaryDonations } from './helpers';
import CardGrid from './component/CardGrid';
import './App.css';

class App extends Component {
  state = {
    charities: [],
    selectedCharity: null,
    isDonationWindowOpen: false,
  };

  componentDidMount() {
    this.fetchCharities();
    this.fetchPayments();
  }

  fetchCharities = () => {
    fetch('http://localhost:3001/charities')
      .then(resp => resp.json())
      .then(data => this.setState({ charities: data }));
  }

  fetchPayments = () => {
    fetch('http://localhost:3001/payments')
      .then(resp => resp.json())
      .then(data => {
        const validDonations = data.map(item => item.amount).filter(amount => typeof amount === 'number' && !isNaN(amount));
        this.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount: summaryDonations(validDonations),
        });
      });
  }

  handleDonate = (charitiesId, amount) => {
    if (amount) {
      this.makePayment(charitiesId, amount);
    } else {
      console.error('No amount selected');
    }
  }

  makePayment = (charitiesId, amount) => {
    const self = this;
    fetch('http://localhost:3001/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        charitiesId,
        amount,
        currency: 'THB',
      }),
    })
      .then(response => response.json())
      .then(data => {
        self.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount: parseFloat(data.amount),
        });
        self.props.dispatch({
          type: 'UPDATE_MESSAGE',
          message: 'Thank you for your donation!',
        });
        setTimeout(() => {
          self.props.dispatch({
            type: 'UPDATE_MESSAGE',
            message: '',
          });
        }, 3000);
      })
      .catch(error => {
        console.error('Error making payment:', error);
        self.props.dispatch({
          type: 'UPDATE_MESSAGE',
          message: 'Error making payment. Please try again.',
        });
      });
  }

  handleDonationWindowToggle = (charityId) => {
    this.setState(prevState => ({
      selectedCharity: charityId,
      isDonationWindowOpen: !prevState.isDonationWindowOpen,
    }));
  };

  render() {
    const { donate, message } = this.props;

    const style = {
      color: '#3f61ed',
      margin: '1em 0',
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center',
    };

    return (
      <div>
        <div className="header">
          <h1>Omise Tamboon React</h1>
          <p>All donations: {donate}</p>
        </div>
        <p style={style}>{message}</p>
        <CardGrid
          charities={this.state.charities}
          handleDonate={this.handleDonate}
          isDonationWindowOpen={this.state.isDonationWindowOpen}
          selectedCharity={this.state.selectedCharity}
          handleDonationWindowToggle={this.handleDonationWindowToggle}
        />
      </div>
    );
  }
}

export default connect(state => state)(App);