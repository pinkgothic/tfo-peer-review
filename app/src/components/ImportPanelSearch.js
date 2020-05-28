import React from 'react';

/**
 * Sub-component of ImportPanel; display is mutually exclusive with ImportPanelSelect. Provides user
 * with an input form for searching for TFO labs. Also displays error messages after failed lab
 * searches, and a text box which briefly explains the site's features.
 * 
 * @property {string} errorString: Import error code string to display (if any)
 * @property {function} onSubmit: Function to execute when user submits a lab search.
 */
export default class ImportPanelSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name : ''
        };

        //Bind handler methods to class for easier html scripting.
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameEnterKey = this.handleNameEnterKey.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
    }

    /**
     * Updates the name state. Intended handler for text input element.
     * @param {event} event 
     */
    handleNameChange(event) {
        this.setState({name : event.target.value})
    }
    
    /**
     * Calls onSubmit event when enter key is pressed. Intended handler for text input element.
     * @param {event} event 
     */
    handleNameEnterKey(event) {
        var code = event.keyCode || event.which;
        //13 is the enter keycode
        if (code === 13) { 
            this.handleNameSubmit();
        }
    }

    /**
     * Calls onSubmit event. Intended handler for button element.
     */
    handleNameSubmit() {
        this.props.onSubmit(this.state.name);
        this.setState({name : ''});
    }

    render () {
        return (
            <div className="import-panel">
                <div className="import-panel-search">
                    <div className="import-panel-controls">
                        <div style={{textAlign : 'left'}}>Lab Name:</div>
                        <div><input 
                            type="text" 
                            style={{width: '150'}}
                            value={this.state.name} 
                            onChange={this.handleNameChange}
                            onKeyPress={this.handleNameEnterKey}
                        /></div>
                        <button onClick={this.handleNameSubmit}>Open Lab</button>
                    </div>
                    <div className="import-panel-search-text">Welcome to the peer review network, a place to review other scientists’ creatures and to have your own reviewed as well. After all, peer review is a very important part of the scientific process!<br/><br/> Please start by entering your lab’s name and submitting your creatures. Then scroll down a bit and click away. If you find any adult creatures, please mark them by clicking the red [X] under their portrait. Every click helps! Thank you for doing your part.
                    </div>
                    <div className="import-panel-search-error">
                        {this.props.errorString}
                    </div>
                </div>
            </div>
        )
    }
}
