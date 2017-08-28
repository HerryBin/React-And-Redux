import React from 'react';
import '../less/header.less';

let header = React.createClass({

    render() {
        return (
       		<div className='row components-header'>
       			<img src='/static/images/logo.png' width='40' className='-col-auto'/>
       			<h1 className='caption'>Hi,Good Music Player</h1>
       		</div>
        );
    }
});
export default header;