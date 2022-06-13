import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

//dependencies
import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";

// model


const App =() => {
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);

  const loadModel = async () =>{
    const recognizer = await speech.create("BROWSER_FFT")
    console.log('Model Loaded')
    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels())
    setModel(recognizer)
    setLabels(recognizer.wordLabels())
  }

  useEffect(()=>{loadModel()}, []); 
  
  function argMax(arr){
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  // const transferRecognizer = baseRecognizer.createTransfer('colors');


  const recognizeCommands = async () =>{
    console.log('Listening for commands')
    model.listen(result=>{
      // console.log(labels[argMax(Object.values(result.scores))])
      console.log(result.spectogram)
      setAction(labels[argMax(Object.values(result.scores))])
    }, {includeSpectrogram:true, probabilityThreshold:0.9})
    setTimeout(()=>model.stopListening(), 10e3)
  }


  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <h1 class="tittle">Basic Speech Recognition App</h1>
        <p>This app is made using tensorflow js's pretrained model speech-commands</p>
        <button class="btn" onClick={recognizeCommands}>Command</button>
        {action ? <div>{action}</div>:<div>No Action Detected</div> }
      </header>
    </div>
  );
}

export default App;
