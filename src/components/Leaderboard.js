import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

class Leaderboard extends Component {
    componentWillMount() {
        setTimeout(() => {this.getScores()}, 100);
    }

    getScores() {
        const msg = JSON.stringify({type: 'scores'})
        this.props.ws.send(msg);
    }
    
    render() {
        console.log(this.props.scores);
        return (
            <div>
            <AutoSizer>
            {({ width }) => (<Table
            width={800}
            height={600}
            headerHeight={20}
            rowHeight={30}
            rowCount={this.props.scores.data.length}
            rowGetter={({ index }) => this.props.scores.data[index]}
            >
            <Column
                label='Character'
                dataKey='character_name'
                width={300}
                />
                {[1,2,3,4,5,6,7].map((episode_number) => (
                    <Column
                    width={100}
                    label={`S07E0${episode_number}`}
                    dataKey={`S07E0${episode_number}`}
                    />))}
            </Table>)}
            </AutoSizer>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => ({  
    scores: state.user_data.scores,
    ws: state.user_data.ws,
});

const LeaderboardContainer = connect(  
    mapStateToProps,
)(Leaderboard);

export default LeaderboardContainer;  
