import React, { Component } from 'react';
import FilePicker from './FilePicker';
import FileValidator from '../abis/FileValidator.json';
import Web3 from 'web3';
import timestamp from 'unix-timestamp';
import tsformat from 'timestamp-format';
const HEX_PREFIX = '0x';
class VerifyForm extends Component {
  constructor(props) {
    super(props);
    this.FilePicker1 = React.createRef();
    this.contracts = [];
  }

  state = {
    selected: false,
    currContractAdr: '',
    contractOwner:'',
    createdAt:null,
    verification:null,
  }

  assignAddress = (event) => {
    this.setState({ currContractAdr: event.target.value });
  }

  getInfo = async () => {
    let web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const abi = FileValidator.abi;
    var contractAddress = this.state.currContractAdr;
    try {
      const fileValidator = web3.eth.Contract(abi, contractAddress);
      const called = await fileValidator.methods.info().call();
      if (called === null) {
        throw new ReferenceError()
      }
      this.setState({contractOwner:called[0]});
      this.setState({createdAt:tsformat('dd/MM/yyyy hh:mm:ss',timestamp.toDate(called[1].toNumber()))})
    }
    catch (err) {
     
    }
  }
  
  verify = async () => {
    let web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const abi = FileValidator.abi;
    var contractAddress = this.state.currContractAdr;
    const contractParam = HEX_PREFIX + this.FilePicker1.current.state.fileHash;
    try {
      const fileValidator = web3.eth.Contract(abi, contractAddress);
      const called = await fileValidator.methods.verify(contractParam).call();
      if (called === null) {
        throw new ReferenceError()
      }
      this.setState({verification:called});
    }
    catch (err) {
      if (err instanceof ReferenceError) {
        alert("Verification error!");
      } else {
        alert("Unknown error!");
      }
    }
  }

  //reset state
  componentWillUnmount (){ 
    this.setState({contractOwner:''})
    this.setState({createdAt:null})
    this.setState({verification:null})
  }
  render() {
    return (
      <div>
        <br></br>
        <legend> Select file to verify its content.</legend>
        <br></br>
        <label>Contract address: <input type="text" value={this.state.currContractAdr} onChange={this.assignAddress}></input></label>
        <p  >{this.state.contractOwner ? `Owner address: ${this.state.contractOwner}`:''}</p>
        <p>{this.state.createdAt ? `Created at: ${this.state.createdAt}`:''}</p>
        <button type="button" className="mb-5 btn-info btn-md"  onClick={this.getInfo}>Get contract info!</button>
        <br></br>
        <FilePicker ref={this.FilePicker1} style={{ display: 'inline' }} > </FilePicker>
        <br></br>
        <button className="secondary-bg primary-color btn-lg border-0 " onClick={this.verify}> Verify content</button>
        <p>{this.state.verification!==null ?`Verification result: ${this.state.verification}`:'' }</p>
      </div>
    );
  }
}

export default VerifyForm;