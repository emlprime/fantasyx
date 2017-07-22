import React, { Component } from 'react';
import { connect } from 'react-redux';

const styles = {
    marginLeft: '1em'
}

const rowStyles = {
    
}

const scoreStyles = {
    width: '2em',
    textAlign: 'right',
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.renderRubricSection = this.renderRubricSection.bind(this);
    }
    componentWillMount() {
        setTimeout(() => {this.getRubric()}, 100);
    }

    getRubric() {
        // console.log("getting rubric");
        const msg = JSON.stringify({type: 'rubric'})
        this.props.ws.send(msg);
    }
    
    renderRubricSection(rubric, section) {
        let rendered_section = <tr></tr>;
        if (rubric[section]) {
            // console.log("section:", rubric[section])
            rendered_section = rubric[section].map((row) => {
                // console.log("row:", row);
                // console.log("description:", row.description);
                // console.log("points:", row.points);
                return <tr style={rowStyles} key={row.description}><td>{row.description}</td><td style={scoreStyles}>{row.points}</td></tr>
            });
        }
        return rendered_section;
    }
    
    render() {
        // console.log("rubric:", this.props.rubric);
        // console.log("about to render section");
        let plot_section = this.renderRubricSection(this.props.rubric, 'Plot');
        let blood_section = this.renderRubricSection(this.props.rubric, 'Blood');
        let rhetoric_section = this.renderRubricSection(this.props.rubric, 'Rhetoric');
        let sex_section = this.renderRubricSection(this.props.rubric, 'Sex');
        // console.log("finished rendering  section");
        // console.log("plot section: ", plot_section);
        return (
                <div style={styles}>
                <h2>Home</h2>
                <p>Welcome to aGoT: the place where we all choose the characters we like best, and Ted takes all the points because Ramsay Bolton is an asshole.</p>
                <p>The draft will open on July 14th. Registrations will be predetermined and by invitation only. Players will be randomly sorted into an S curve Seed list.</p>
                <p>Trades can occur at any point except the blackout period (for now the day of the episode, we'll get better next week). We will show the confirmations on the page. Please only discuss the details with those who have already confirmed that they have watched.</p>
<p>The judges will be me...only me!!! I will, with no partiality, award points based on the rubric. I reserve the right to take into account reasonable arguments, impassioned pleas delivered via YouTube, written notes from Geroge R.R. Martin himself, and of course bribes.</p>
<p>I have commissioned an Iron Throne which must be sat upon during the entire episode by the current points leader. It will be very pokey and uncomfortable, but it is also the most prestigious seat in the land. You're welcome. If you choose not to sit on it, well...shame...shame...shame...</p>
                                                                             <table>
                                                                             <thead>
                                                                             <tr>
                                                                             <th colSpan="2">Rubric</th>
                                                                             </tr>
                                                                             </thead>
                                                                             <tbody>
                                                                             <tr><th colSpan="2">Plot</th></tr>
                                                                             {plot_section}
                                                                             <tr><th colSpan="2">Blood</th></tr>
                                                                             {blood_section}
                                                                             <tr><th colSpan="2">Rhetoric</th></tr>
                                                                             {rhetoric_section}
                                                                             <tr><th colSpan="2">Sex</th></tr>
                                                                             {sex_section}
                                                                             </tbody>
                                                                             </table>
                                                                             </div>
                                                                            
                                                                            );
        }
    }

    const mapStateToProps = (state, ownProps) => ({  
    rubric: state.rubric,
    ws: state.ws,
});

const HomeContainer = connect(  
    mapStateToProps,
)(Home);

export default HomeContainer;  
