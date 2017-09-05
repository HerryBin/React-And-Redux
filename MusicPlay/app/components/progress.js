import React from 'react';
import '../less/progress.less'
/**
 * React中的数据分为 state and props
 * state 组件本身的数据
 * props 从其他组件传入的数据
 */

class Progress extends React.Component{
    constructor(props) {
        super(props);
        this.changeProgress = this.changeProgress.bind(this);
    }
	changeProgress(e){
		let progressBar=this.refs.progressBar;
		console.dir(progressBar);
		let progress=(e.clientX-progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
		console.log(progress);
        this.props.onProgressChange && this.props.onProgressChange(progress);
	}
    render() {
        return (
        	 /*<div>亲，已播放 {this.props.progress}s</div>*/
        	 <div className='components-progress' ref='progressBar' onClick={this.changeProgress}>
        	 	<div className='progress' style={{width:`${this.props.progress}%`,background: this.props.barColor}}></div>
        	 </div>
        );
    }
}

export default Progress;