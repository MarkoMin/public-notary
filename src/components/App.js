import React, { Component } from 'react';
import './App.css';
import NewContractForm from './NewContractForm';
import Web3 from 'web3';
import VerifyForm from './VerifyForm';


class App extends Component {
  state = {
    account_addr: '',
    selected: 'left',
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadAcc();
    //reloads account!
    window.ethereum.on('accountsChanged', async (accounts) => {
      try {
        await this.loadAcc();
      }
      catch (err) {
        this.setState({ account_addr: '' });
      }
    })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Non-Ethereum browser!");
    }
  }

  async loadAcc() {
    const web3 = window.web3;
    const acc = await web3.eth.getAccounts();
    this.setState({ account_addr: acc[0] });
  }

  select = () => this.state.selected === 'left' ? this.setState({ selected: 'right' }) : this.setState({ selected: 'left' })

  render() {
    var menuHTML =
      (<div className="text-center d-flex justify-content-center m-5">
        <button type="button" className={`menu-btn left-btn ${this.state.selected === 'left' ? 'selected-btn' : ''}`} onClick={this.select}>Add contract</button>
        <button type="button" className={`menu-btn right-btn ${this.state.selected === 'right' ? 'selected-btn' : ''}`} onClick={this.select}>Verify</button>
      </div>);

    var formHTML = (<NewContractForm handler={this.handler} own_address={this.state.account_addr}>
    </NewContractForm>);
    if (this.state.selected === 'right') {
      formHTML = (<VerifyForm handler={this.handler}>
      </VerifyForm>);
    }

    return (
      <div className="text-center primary-color">
        <div className="primary-bg">
          <h1 className="primary-bg display-1 text-weight-bold">
            File Validator
          </h1>
          <p>Your account:</p>
          <p className="secondary-bg p-1 d-inline">{this.state.account_addr ? this.state.account_addr : 'No account selected'}</p>
        </div>
        {menuHTML}
        {formHTML}
      </div>
    );
  }
}
export default App;