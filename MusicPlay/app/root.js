import React from 'react';
import Header from './components/header';
import Player from  './page/player';
import MusicList from './page/musicList'
import { Router,IndexRoute,Route,hashHistory,Link } from 'react-router';
import Pubsub from 'pubsub-js';
import { MUSIC_LIST } from './config/musicList'; //musicList 没有进行 export default 操作，加 { }

/**
* react生命周期:
* getDefaultProps
* getInitialState
* componentWillMount
* render
* componentDidMount
* componentWillUnmount
 */
class  App extends React.Component{
	/*getDefaultProps(){
		return{
			barColor:'#2f9842'
		}
	}*/
	/*getInitialState() {
		return {
			musicList: MUSIC_LIST,
			currentMusitItem: {}
		}
	}*/

	constructor(props) {
    	super(props),
	    this.state = {
	    	musicList: MUSIC_LIST,
			currentMusitItem: {},
			barColor:'#2f9842'
	    }
	}
	playMusic(music){
		$("#player").jPlayer('setMedia',{
			mp3:music.file
		}).jPlayer('play');

		/* 给Player 传递当前播放歌曲信息*/
		this.setState({
			currentMusitItem: music
		});
	}
	playNext(type='next'){
		let index=this.fundMusicIndex(this.state.currentMusitItem),
			nextIndex=null,
			musicLen=this.state.musicList.length;
		if(type==='next'){
			nextIndex=(index+1) % musicLen;
		}else{
			nextIndex=(index-1 + musicLen) % musicLen;
		}

		this.playMusic(this.state.musicList[nextIndex]);
	}
	fundMusicIndex(musicItem){
		return this.state.musicList.indexOf(musicItem);
	}
	componentDidMount() {
/*		$("#player").jPlayer({
			ready:function(){
				$(this).jPlayer('setMedia',{
					mp3:MUSIC_LIST[0].file
				}).jPlayer('play');
			},
			supplied:'mp3',
			vmode:'window'
		});*/
		$('#player').jPlayer({
			supplied:'mp3',
			wmode:'window',
			useStateClassSkin:true
		});

		this.playMusic(MUSIC_LIST[0]);

		$('#player').bind($.jPlayer.event.ended,(e)=>{
			this.playNext();
		});

		//事件订阅 
		/**删除音乐*/
		Pubsub.subscribe('DEL_MUSIC',(msg,musicItem)=>{
			this.setState({
				musicList:this.state.musicList.filter(item=>{
					return item !==musicItem;
				})
			});
		});

		/**播放音乐*/
		Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem)=>{
			this.playMusic(musicItem);
		});

		/**后一首*/
		Pubsub.subscribe('PLAY_NEXT',(msg)=>{
			this.playNext();
		});

		Pubsub.subscribe('PLAY_PREV',(msg)=>{
			this.playNext('prev');
		});
	}
	componentWillUnmount() {
		Pubsub.unsubscribe('DEL_MUSIC');
		Pubsub.unsubscribe('PLAY_MUSIC');
		Pubsub.unsubscribe('PLAY_NEXT');
		Pubsub.unsubscribe('PLAY_PREV');

		$('#player').unbind($.jPlayer.event.ended);
	}
	/* 往 组件传递参数的名称 不要传入 improt 中的字段*/
	/*render() {
        return (
        	<div>
        		<Header/>
        		<Player currentMusitItem={ this.state.currentMusitItem }/>
        		
        	</div>
        )
    }*/
	render() {
        return (
        	<div>
        		<Header/>
        		
        		{
        			React.cloneElement(
        				this.props.children, 
	        			{	musicList: this.state.musicList, 
	        				currentMusitItem: this.state.currentMusitItem
	        			}
        			)
        	 	}
        	</div>
        )
    }
}

/** 使用Router，外层一定要用 <Router> 包裹起来 */
class Root extends React.Component{
	render() {
	    return (
		    <Router history={hashHistory}>
		        <Route path="/" component={App}>
		            <IndexRoute component={Player}/>
		            <Route path="/musicList" component={MusicList} />
		        </Route>
		    </Router>
		);
	}
}

export default Root;