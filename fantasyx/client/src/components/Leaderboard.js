import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            report: 'csr',
            canon: 'canon'
        };
        this.toggleReport = this.toggleReport.bind(this);
        this.toggleCanon = this.toggleCanon.bind(this);
    }

    toggleReport() {
        const new_report = this.state.report === 'csr' ? 'usr' : 'csr';
        this.setState({report: new_report});
    }
    
    toggleCanon() {
        const new_canon = this.state.canon === 'canon' ? 'altfacts' : 'canon';
        this.setState({canon: new_canon});
        setTimeout(() => {this.getScores()}, 100);
    }
    
    componentWillMount() {
        setTimeout(() => {this.getScores()}, 100);
    }

    getScores() {
        const msg = JSON.stringify({type: 'scores', options: {include: this.state.canon}})
        this.props.ws.send(msg);
    }
    
    render() {
        const csr = this.props.scores.character_score_report;
        const usr = this.props.scores.user_score_report;

        if(!csr || !usr) {
            return (<div> Loading...</div>)
        }

        let report = usr;
        let label = 'Player';
        let dataKey = 'user_name';
        
        if (this.state.report === 'csr') {
            report = csr;
            label = 'Character';
            dataKey = 'character_name';
        }

        let canon_button_text = 'Toggle to AltFacts';
        if (this.state.canon === 'altfacts') {
            canon_button_text = 'Toggle to Canon';
        }
        
        return  (
            <div>
            <button onClick={this.toggleReport}>Toggle Report</button>
            <button onClick={this.toggleCanon}>{canon_button_text}</button>
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
    scores: state.scores,
    ws: state.ws,
});

const LeaderboardContainer = connect(  
    mapStateToProps,
)(Leaderboard);

export default LeaderboardContainer;  
