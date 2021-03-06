'use strict'

const React = require('react')
const Editor = require('./editor')
const GistActions = require('../../actions/gist')
const AppActions = require('../../actions/app')
const remote = require('remote')
const shell = remote.require('shell')
const {autobind} = require('core-decorators')
const propTypes = {
  note: React.PropTypes.object,
  style: React.PropTypes.object
}
const defaultProps = {
  style: {}
}

class Workspace extends React.Component {

  constructor (options) {
    super(options)
  }

  getContent () {
    if (this.props.note) {
      const fileNames = Object.keys(this.props.note.files)
      const note = this.props.note.files[fileNames[0]]
      AppActions.setTitle(fileNames[0])
      return note.content
    }

    return 'Open a note by clicking a note in the sidebar'
  }

  @autobind
  onFileChange (content, id) {
    if (this.props.note) {
      const fileNames = Object.keys(this.props.note.files)
      if (this.props.note.id !== id || this.props.note.files[fileNames[0]].content === content) {
        return
      }
      this.props.note.files[fileNames[0]].content = content
      GistActions.update(this.props.note.id, this.props.note)
    }
  }

  @autobind
  onLinkClick ({token}) {
    shell.openExternal(token.value);
  }

  render () {
    const content = this.getContent()
    const id = this.props.note ? this.props.note.id : 'startup'
    const editor = (
      <Editor
        id={id}
        value={content}
        onChange={this.onFileChange}
        onLoad={this.onFileChange.cancel}
        onLinkClick={this.onLinkClick} />
    )

    return (
      <div className='workspace' style={this.props.style}>
        {editor}
      </div>
    )
  }
}

Workspace.propTypes = propTypes
Workspace.defaultProps = defaultProps

module.exports = Workspace
