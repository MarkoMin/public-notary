import React, { Component } from 'react';
import FilePicker from './FilePicker';
import FileValidator from '../abis/FileValidator.json';
import Web3 from 'web3';
const HEX_PREFIX = '0x';
var ethJsUtil = require('ethereumjs-util');

class NewContractForm extends Component {
  constructor(props) {
    super(props);
    this.FilePicker1 = React.createRef();
    this.own_address = '';
  }
  state = {
    selected: true,
    deployedAddr: '',
  }

  deploy = async () => {
    let web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const abi = FileValidator.abi;
    const bytecode = FileValidator.bytecode;
    var contractAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
                    this.props.own_address, await web3.eth.getTransactionCount(this.props.own_address)));
    var owner = this.props.own_address;
    const fileValidator = web3.eth.Contract(abi, contractAddress);
    const contractParam = HEX_PREFIX + this.FilePicker1.current.state.fileHash;
    await fileValidator.deploy({ data: bytecode, arguments: [contractParam] }).send({
      from: owner,
      gas: 1500000,
      gasPrice: 20000000000
    }).on('confirmation', () => { this.setState({ deployedAddr: contractAddress }) })
      .on('error', () => { this.setState({ deployedAddr: 'error' }) });
  }

  //reset state
  componentWillUnmount() { this.setState({ deployedAddr: '' }) }


  render() {
    return (
      <div>
        <br></br>
        <legend> Select file to deploy new smart contract.</legend>
        <br></br>
        <FilePicker ref={this.FilePicker1} style={{ display: 'inline' }} > </FilePicker>
        <br></br>
        <button className="secondary-bg primary-color btn-lg border-0" onClick={this.deploy}> Deploy contract</button>
        <br></br>
        <p>{this.state.deployedAddr ? `Contract address: ` : ''}</p>
        <p>{this.state.deployedAddr}</p>
      </div>
    );
  }
}
export default NewContractForm;