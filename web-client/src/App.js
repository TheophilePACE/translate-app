import React, { Component } from 'react';

const { request } = require("graphql-request")

const query = (sentenceToTranslate, from, to) => `{
    translation(sentenceToTranslate: "${sentenceToTranslate}",from:"${from}", to:"${to}") {
      correctedInput,
      text,
      input,
      inputCorrect
    },
    definition(wordToDefine: "${sentenceToTranslate.split(' ').shift().toLowerCase()}") {
      definitionNumber,
      definitions {
        partOfSpeech
        text
        sourceDictionnary
      }
    }
  }`

class Translator extends Component {
  render = () => {
    console.log(this.props)
    console.log('render Translater')
    return (
      <div key="translator">
        <div key="translation">
          <h2>
            Translator
          </h2>
          <p>
            {this.props.translation.text}
          </p>
        </div>
        <div>
          {
            (this.props.translation.correctedInput) ?
              (<div>
                Did you mean "{this.props.translation.correctedInput}"?
                  <button onClick={this.props.correctInput}>
                  Yes
                  </button>
              </div>)
              : null
          }
        </div>
        <div >
          {(this.props.translation.inputCorrect)
            ? (
              <label style={{ color: 'green' }}> &#x2714;</label>)
            : null}
        </div>
      </div>
    )
  }
}

class Dictionary extends Component {
  render = () => {
    console.log('render Dictionary')
    console.log(this.props)
    const definitionList = (this.props.definitions.definitionNumber) ?
      (<div>
        <b> {this.props.sentence.split(' ').shift().toLowerCase()} </b>
        <ul>
          {this.props.definitions.definitions.map((d, index) =>
            (
              <li key={"definition" + index}>
                <i> ( {d.partOfSpeech} )</i> : {d.text}
              </li>)
          )
          }
        </ul>
      </div>)
      : (<p> No definition for {this.props.sentence.split(' ').shift().toLowerCase()} </p>)
    return (
      <div>
        <h2> Definition </h2>
        {definitionList}
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translation: {},
      sentence: "wilcome to Australia!",
      definitions: {}
    }
  }

  componentDidMount = () =>
    this.updateTranslation(this.state.sentence)


  handleChangeInput = (newValue) => {
    console.log('handleChangeInput')
    this.setState((prevSate, props) => ({ sentence: newValue, translation: prevSate.translation }))
    this.updateTranslation(newValue)
  }

  updateTranslation = (oldSentence) =>
    request("/translation", query(oldSentence, "en", "fr"))
      .then(resp => {
        console.log(resp)
        if (resp.translation.input === this.state.sentence)
          this.setState((prevState, props) =>
            ({
              sentence: prevState.sentence,
              translation: resp.translation,
              definitions: resp.definition
            })
          )
      }
      )

  correctInput = (event) => {
    console.log('correctInput')
    this.refs.input.value = this.state.translation.correctedInput
    this.handleChangeInput(this.state.translation.correctedInput)
  }

  render() {
    console.log('render App')
    return (
      <div className="App">
        <h1>Minimalist Translation Application</h1>
        <label>
          <input
            ref="input"
            type="text"
            defaultValue={this.state.sentence}
            autoFocus
            onChange={(event) => this.handleChangeInput(event.target.value.replace(/[^\w\s]/gi, ''))} />
        </label>
        <Translator sentence={this.state.sentence} translation={this.state.translation} correctInput={this.correctInput} />
        <Dictionary sentence={this.state.sentence} definitions={this.state.definitions} />
      </div>
    );
  }
}

export default App;