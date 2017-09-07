import React from 'react';
import Pubsub from 'pubsub-js';
require('../less/listitem.less');

/*采用事件订阅方式 进行 点击事件*/
/*let ListItem = React.createClass({ a(){},b() {},render(){}  })*/
class ListItem extends React.Component{

	deleteHandler(item, event) {
		event.stopPropagation(); //事件冒泡，会影响 播放功能
		PubSub.publish('DEL_MUSIC', item);
	}

	playMusic(item, event) {
		PubSub.publish('PLAY_MUSIC', item);
	}

    render() {
    	let item = this.props.oneMusicItem;
        return (
            <li className={`row components-listitem${this.props.focus ? ' focus' : ''}`} 
            onClick={this.playMusic.bind(this, item)}>
                <p><span className="bold">{item.title}</span>  -  {item.artist}</p>
                <p className="-col-auto delete" onClick={this.deleteHandler.bind(this, item)}></p>
            </li>
        );
    }
}

export default ListItem;