import React from 'react';
import Progress from '../components/progress';
import { Link } from 'react-router';
import Pubsub from 'pubsub-js';

require('../less/player.less');

/**分离播放器内容*/
let duration=null;// 音乐总时长

class Player extends React.Component{
	/*getInitialState(){
			//初始化
		return{
			progress: 0, //播放进度
			volume: 0, //声音大小
			beforeVolume:0,
			isPlay: true, //是否播放 
			leftTime: '', //音乐剩余时间,
			repeatType:'cycle'
		}
	}*/
	constructor(props) {
    	super(props),
	    this.state = {
	      progress: 0,
	      volume: 0,
	      isPlay: true,
	      leftTime: '',
	      repeatType:'cycle'
	    },
	    this.progressChangeHandler = this.progressChangeHandler.bind(this);
	    this.changeVolumeHandler = this.changeVolumeHandler.bind(this);
	    this.play = this.play.bind(this);
	}
	componentDidMount() {

		/** 事件绑定后一定要记得解绑 */
		$('#player').bind($.jPlayer.event.timeupdate,(e)=>{
			/* 这里会反复运行*/
			duration=e.jPlayer.status.duration;
			this.setState({
				/*progress:Math.round(e.jPlayer.status.currentTime)*/
				progress:e.jPlayer.status.currentPercentAbsolute,
				volume: e.jPlayer.options.volume*100,
				leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
			})
		});
	}
	componentWillUnmount() {
		$('#player').unbind($.jPlayer.event.timeupdate);
	}
	formatTime(time) {
		time = Math.floor(time);
		let miniute = Math.floor(time / 60);
		let seconds = Math.floor(time % 60);

		return miniute + ':' + (seconds < 10 ? '0' + seconds : seconds);
	}
	//自定义事件 拖拽播放进度
	progressChangeHandler(progress){
		//
		//调用JqPlayer 逐渐
		$('#player').jPlayer(this.state.isPlay?'play':'pause',duration*progress);
	}
	//调节声音大小
	changeVolumeHandler(progress){
		$("#player").jPlayer("volume", progress);
		this.setState({
				volume: progress
		});
	}
	//暂停 播放
	play() {
		if (this.state.isPlay) {
			$("#player").jPlayer("pause");
		} else {
			$("#player").jPlayer("play");
		}
		this.setState({
			isPlay: !this.state.isPlay
		});
	}
	turnVolume(){
		console.log(this.state.volume+'-----'+this.state.beforeVolume);
		if(this.state.volume==0){
			$("#player").jPlayer("volume",this.state.beforeVolume);
		}else{

			this.setState({
				beforeVolume: this.state.volume
			});
			$("#player").jPlayer("volume",0);
		};
		
	}
	playPrev(){
		PubSub.publish('PLAY_PREV');
	}
	playNext(){
		PubSub.publish('PLAY_NEXT');
	}
    render() {
        return (
       		<div className="player-page">
       			<h1 className="caption"><Link to="/musicList">我的私人音乐坊 &gt;</Link></h1>
       			  <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusitItem.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusitItem.artist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}} onClick={this.turnVolume}></i>
                				<div className="volume-wrapper">
					                <Progress
										progress={this.state.volume}
										onProgressChange={this.changeVolumeHandler}
										barColor='#89120F'
					                >
					                </Progress>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px'}}>
			                <Progress
								progress={this.state.progress}
								onProgressChange={this.progressChangeHandler}
			                >
			                </Progress>
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" onClick={this.playPrev}></i>
	                			<i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play}></i>
	                			<i className="icon next ml20" onClick={this.playNext}></i>
                			</div>
                			<div className="-col-auto">
                				<i className={`icon repeat-${this.state.repeatType}`} onClick={this.changeRepeat}></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                		<img src={this.props.currentMusitItem.cover} alt={this.props.currentMusitItem.title}/>
                	</div>
                </div>
       		</div>
        );
    }
}

export default Player;