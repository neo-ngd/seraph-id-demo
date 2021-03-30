// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React from 'react';
import './HelpPage.css';
import logo from '../../assets/seraph-logo.svg';
import neoLogo from '../../assets/neo-logo.png';
import { Link } from 'react-router-dom';
import { Fab, Grid, Tooltip, List, ListItem, ListItemIcon } from '@material-ui/core';
import { ApplicationContext, initialTip, Agents } from '../../application-context';
import AccountCircleIcon from '@material-ui/icons/AccountCircleOutlined';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import HelpIcon from '@material-ui/icons/HelpOutlineOutlined';




interface Props {
    help: boolean;
    afterReset: boolean;
}

function HelpPage({ help, afterReset }: Props) {

    const resetContext = (value: any) => {
        value.nextTip(initialTip);
        value.changeAction('govPageAsOwner', 'toFillForm');
        value.changeAction('govPageAsGov', 'noRequests');
        value.changeAction('agencyPageAsOwner', 'toChooseAFlat');
        value.changeAction('agencyPageAsAgency', 'noRequests');
        value.changeAction('demoOwnerDID', 'todo');
        value.changeAction('demoOwnerCredFromGov', 'todo');
        value.changeAction('demoOwnerCredFromAgency', 'todo');
        value.changeAction('demoOwnerOpenDoor', 'todo');
        value.changeAction('demoGov', 'noRequests');
        value.changeAction('demoAgency', 'noRequests');
        value.changeAction('demoLandlord', 'noRequests');

        value.passportClaim = null;
        value.accessKeyClaim = null;

        value.resetContext(true);
        localStorage.removeItem('gender');

    }


    return (
        <ApplicationContext.Consumer>
            {(value: any) => (

                <div className="HelpPageContainer">
                    <Tooltip title="Go to Seraph ID landing page" placement="top">
                        <a href="https://www.seraphid.io/">
                            <img src={logo} alt="SeraphID logo" className="SeraphLogo" />
                        </a>
                    </Tooltip>
                    <h2> Self Sovereign Identity on  <img src={neoLogo} alt="NEO logo" className="NeoLogo" /> </h2>

                    <Grid container spacing={0}>

                        <Grid item xs={2} sm={3}> </Grid>
                        <Grid item xs={8} sm={6}>
                            <h4>  Help {Agents.owner} to book an accommodation </h4>
                            <div className="HelpText">
                                <p>

                                    <em className="AccentKeyWord"> {Agents.owner} </em> is looking for an accommodation.
                                    He has discovered a new smart shared <em className="AccentKeyWord"> accommodation dApp </em>
                                    built on top of the NEO blockchain. To make the reservation, the dApp requires {Agents.owner} to identify himself as an individual.

                                    Fortunately for {Agents.owner}, his <em className="AccentKeyWord"> {Agents.government} </em> has recently decided to implement a digital version of the national ID with the help of the NEO blockchain. {Agents.owner} needs to apply for a digital ID  by presenting his physical ID to a local authority.
                                    At the moment of booking, {Agents.owner} can identify himself to the dApp with his digital Passport.
                                    Once the identity is verified, the dApp issues an access key credential to {Agents.owner}. Among the other things, the access key contains a
                                    code that gives access to an automatic door to enter the accommodation.

                                    When {Agents.owner} arrives at his accommodation, he displays the booking confirmation to
                                    the <em className="AccentKeyWord"> {Agents.landlord}</em>, an automatic door with a IoT device capable to verify {Agents.owner}'s claim.
                                    Once the booking is verified, {Agents.owner} is finally able to enter the accommodation.

                                 </p>

                                <p> Demo Instruction: </p>

                                <List>
                                    <ListItem className="DemoInstructionItem">
                                        <ListItemIcon>
                                            <AccountCircleIcon className="DemoInstructionsIcons" />
                                        </ListItemIcon>
                                        <p>
                                            On the main screen you will find four <strong className="AccentKeyWord"> cards </strong>, one for each agent. When you interact with {Agents.owner}'s card, you'll act in behalf of him.
                                            So for the other three agents.
                                         </p>

                                    </ListItem>

                                    <ListItem className="DemoInstructionItem">
                                        <ListItemIcon>
                                            <InfoIcon className="DemoInstructionsIcons" />
                                        </ListItemIcon>
                                        <p>
                                            At the bottom of the page, you'll always find a yellow box with a <strong className="AccentKeyWord">  hint </strong>, which suggests you the next move.
                                        </p>
                                    </ListItem>

                                    <ListItem className="DemoInstructionItem">
                                        <ListItemIcon>
                                            <HelpIcon className="DemoInstructionsIcons" />
                                        </ListItemIcon>
                                        <p>
                                            At any time, you can come back to this screen by clicking a <strong className="AccentKeyWord"> help </strong> button in the top-right corner of every page.
                                            You can also reset the whole demo and restart from scratch if anything goes wrong.
                                        </p>
                                    </ListItem>
                                </List>

                            </div>


                        </Grid>
                        <Grid item xs={2} sm={3}> </Grid>
                    </Grid>

                    {help ? (
                        <div className="PageActions">

                            <Link to="/dashboard" className="DashboardLink">
                                <Fab variant="extended" onClick={() => value.resetContext(false)} color="primary">
                                    Go back to demo
                                    </Fab>
                            </Link>

                            {afterReset ? (
                                <Fab variant="extended" className="RightButton">
                                    Reset
                                        </Fab>
                            ) : (
                                    <Fab onClick={() => resetContext(value)} variant="extended" color="primary" className="RightButton">
                                        Reset
                                        </Fab>
                                )}

                        </div>
                    ) : (
                            <div className="PageActions">

                                <Tooltip title="Create another DID and restart from scratch">
                                    <Link to="/dashboard" className="DashboardLink">
                                        <Fab variant="extended" onClick={() => resetContext(value)} color="primary" className="RightButton">
                                            Let's start
                                        </Fab>
                                    </Link>
                                </Tooltip>
                            </div>
                        )}
                </div>
            )}
        </ApplicationContext.Consumer>
    );



}

export default HelpPage;
