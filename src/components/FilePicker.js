import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import './App.css';
const { Keccak } = require('sha3');

class FilePicker extends Component {
  state = {
    fileName: '',
    fileHash: ''
  }

  handleFile = (file) => {
    this.setState({ fileName: file.fileList[0].name });
    let _b64 = file.base64.substr(23);
    // removes prefix that was added while converting to base64
    // pure base64 left in _b64
    const hasher = new Keccak(256);
    hasher.update(_b64);
    const _fileHash = hasher.digest('hex');
    document.getElementById('file-input').value = this.state.fileName;
    this.setState({ fileHash: _fileHash });
  }

  render() {
    return (
      <div className="text-center">
        <div className="d-flex-inline">
          <div className="d-flex justify-content-center">
            <ReactFileReader fileTypes={['*/*']} base64={true} multipleFiles={false} handleFiles={this.handleFile}>
              <button type="button" className='btn-success btn-lg primary-color'>Choose file</button>
            </ReactFileReader>
          </div>
          <br></br>
        </div>
        <label>Selected file: <br></br> <input id='file-input' type="text" disabled={true} ></input></label>
      </div>
    );
  }
}

export default FilePicker;
