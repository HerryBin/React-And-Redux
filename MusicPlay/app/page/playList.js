import React from 'react';
import { MUSIC_LIST } from '../config/musicList';
import ListItem from '../components/listItem';

class List extends React.Component{
    render() {
    	let Items = this.props.musicList.map((item) => {
    		return (
    			<ListItem
    				key={item.id}
    				data={item}
                    focus={this.props.currentMusitItem === item}
    			></ListItem>
    		);
    	});
        return (
            <ul>
                { Items }
            </ul>
        );
    }
}

export default List;
