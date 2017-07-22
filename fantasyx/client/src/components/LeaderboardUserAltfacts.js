import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Link,
}                               from 'react-router-dom'

import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

class LeaderboardUserAltfacts extends Component {
    componentWillMount() {
        setTimeout(() => {this.getScores()}, 100);
    }

    getScores() {
        const msg = JSON.stringify({type: 'scores', options: {pivot: 'user', canon: 'altfacts'}})
        this.props.ws.send(msg);
    }
    
    render() {
        const report = this.props.report;
        if(!report) {
            return (<div> Loading...</div>)
        }

        let label = 'Player';
        let dataKey = 'user_name';
        
        return  (
            <div>
            <Link to="/leaderboard/user/altfacts">User Altfacts</Link> | 
            <Link to="/leaderboard/user/canon">User Canon</Link> |
            <Link to="/leaderboard/character/altfacts">Character Altfacts</Link> | 
            <Link to="/leaderboard/character/canon">Character Canon</Link>
            <AutoSizer>
            {({ width }) => (<Table
                width={800}
                height={600}
                headerHeight={20}
                rowHeight={30}
                rowCount={report.data.length}
                rowGetter={({ index }) => report.data[index]}
                >
                <Column
                label={label}
                dataKey={dataKey}
                width={300}
                />
                {[1,2,3,4,5,6,7].map((episode_number) => (
                    <Column
                    width={100}
                    label={`S07E0${episode_number}`}
                    dataKey={`S07E0${episode_number}`}
                    key={`S07E0${episode_number}`}
                    />))}
                </Table>)}
            </AutoSizer>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => ({  
    report: state.scores.user_altfacts_report,
    ws: state.ws,
});

const LeaderboardUserAltfactsContainer = connect(  
    mapStateToProps,
)(LeaderboardUserAltfacts);

export default LeaderboardUserAltfactsContainer;  
