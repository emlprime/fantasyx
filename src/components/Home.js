import React from 'react';

const styles = {
    marginLeft: '1em'
}

const rowStyles = {
    
}

const scoreStyles = {
    width: '2em',
    textAlign: 'right',
}

export default () => (
    <div style={styles}>
    <h2>Home</h2>
    <p>Welcome to FantasyX: the place where we all choose the characters we like best, and Ted takes all the points because Ramsay Bolton is an asshole.</p>
    <p>The draft will open on July 15th. Registrations will be predetermined and by invitation only. Players will be randomly sorted into an S curve Seed list.</p>
    <p>Trades can occur at any point except the blackout period between when the episode airs and the point at which all players have confirmed they have seen the episode. When you have finished watching the episode please log in and confirm. We will show the confirmations on the page. Please only discuss the details with those who have already confirmed that they have watched.</p>
    <p>The judges will be Kris and Myself. We will, with no partiality, award points based on the rubric. We reserve the right to take into account reasonable arguments, impassioned pleas delivered via YouTube, written notes from Geroge R.R. Martin himself, and of course Bribes.</p>
    <p>We have constructed an Iron Throne which must be sat upon during the entire episode by the current points leader. It is very pokey and uncomfortable, but it is also the most prestigious seat in the land. You're welcome. If you choose not to sit on it, well...shame...shame...shame...</p>
    <table>
    <thead>
    <tr>
    <th colSpan="2">Rubric</th>
    </tr>
    </thead>
    <tbody>
    <tr><th colSpan="2">Plot</th></tr>
    <tr style={rowStyles}><td>Changed the course of an individual life</td><td style={scoreStyles}>1</td></tr>
    <tr style={rowStyles}><td>Changed the course of a cohesive group or cadre</td><td style={scoreStyles}>2</td></tr>
    <tr style={rowStyles}><td>Changed the course of a war</td><td style={scoreStyles}>5</td></tr>
    <tr style={rowStyles}><td>Changed the course of a polity</td><td style={scoreStyles}>10</td></tr>
    <tr style={rowStyles}><td>Changed the course of a race</td><td style={scoreStyles}>15</td></tr>
    <tr style={rowStyles}><td>Changed the course of the world</td><td style={scoreStyles}>42</td></tr>
    <tr><th colSpan="2">Sex</th></tr>                                                                                         
    <tr style={rowStyles}><td>Engaged in private nudity or salacious behavior</td><td style={scoreStyles}>1</td></tr>
    <tr style={rowStyles}><td>Engaged in private graphic sexual encounters</td><td style={scoreStyles}>2</td></tr>
    <tr style={rowStyles}><td>Engaged in public nudity or salacious behavior</td><td style={scoreStyles}>4</td></tr>
    <tr style={rowStyles}><td>Engaged in public graphic sexual encounters</td><td style={scoreStyles}>6</td></tr>
    <tr style={rowStyles}><td>Engaged in kinky or taboo sexual activity</td><td style={scoreStyles}>10</td></tr>
    <tr style={rowStyles}><td>Prevented another character from engaging in nudity or salacious behavior</td><td style={scoreStyles}>-10</td></tr>
    <tr><th colSpan="2">Blood</th></tr>                                                                                       
    <tr style={rowStyles}><td>Draws own blood</td><td style={scoreStyles}>1</td></tr>
    <tr style={rowStyles}><td>Draws the blood of another</td><td style={scoreStyles}>2</td></tr>
    <tr style={rowStyles}><td>Kills an individual unnamed character</td><td style={scoreStyles}>3</td></tr>
    <tr style={rowStyles}><td>Kills a group of unnamed characters</td><td style={scoreStyles}>5</td></tr>
    <tr style={rowStyles}><td>Consumes a named character</td><td style={scoreStyles}>9</td></tr>
    <tr style={rowStyles}><td>Kills a named character (points per character)</td><td style={scoreStyles}>10</td></tr>
    <tr style={rowStyles}><td>Flips out and kills someone for like...no reason (like a Ninja)</td><td style={scoreStyles}>12</td></tr>
    <tr style={rowStyles}><td>Kills the leader of a polity</td><td style={scoreStyles}>14</td></tr>
    <tr style={rowStyles}><td>Kills the last of a race</td><td style={scoreStyles}>15</td></tr>
    <tr style={rowStyles}><td>Kills using ironic or apropos means</td><td style={scoreStyles}>20</td></tr>
    <tr style={rowStyles}><td>Kills having overcome a crippling fear of violence</td><td style={scoreStyles}>50</td></tr>
    <tr style={rowStyles}><td>Kills a direwolf</td><td style={scoreStyles}>-50</td></tr>
    <tr><th colSpan="2">Rhetoric</th></tr>                                                                                    
    <tr style={rowStyles}><td>Delivers a punchy one liner</td><td style={scoreStyles}>1</td></tr>
    <tr style={rowStyles}><td>Makes a statement which is clearly veiled commentary on the current political climate</td><td style={scoreStyles}>2</td></tr>
    <tr style={rowStyles}><td>Actually says their house words</td><td style={scoreStyles}>4</td></tr>
    <tr style={rowStyles}><td>Says something that reveals a long misunderstood mystery</td><td style={scoreStyles}>5</td></tr>
    <tr style={rowStyles}><td>Says something which could reasonably be printed on a Threadless.com t-shirt</td><td style={scoreStyles}>6</td></tr>
    <tr style={rowStyles}><td>Changes the mind of a character using only words</td><td style={scoreStyles}>10</td></tr>
    </tbody>
    </table>
    </div>
)
