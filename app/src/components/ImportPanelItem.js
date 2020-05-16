import React from 'react';

export default class ImportPanelItem extends React.Component {
    render () {
        return (
            <div className="import-panel-item">
                <div className="creature-image"
                    style={{
                        backgroundImage : 'url('+this.props.src+')',
                        backgroundRepeat : 'no-repeat', 
                        backgroundPosition : '50% 50%'
                    }}/>
                <div>
                    <label>{this.props.code}</label>
                    <input 
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={() => this.props.onCheck(this.props.code, !this.props.checked)}
                />
                </div>
                
            </div>
        )
    }
}