// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React from 'react';
import './Dashboard.css';

import Owner from 'components/IdentityOwner/Owner';
import SmartAgency from 'components/SmartAgency/SmartAgency';
import Government from 'components/Govrnment/Government';
import LandLord from 'components/LandLord/LandLord';
import NavBar from 'components/NavBar/NavBar';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import UserTips from 'components/UserTips/UserTips';


interface Props {
  ownerWallet: any
 }
interface State { }

export class Dashboard extends React.Component<Props, State> {

  public render() {

    return (
      <div className="DashboardContainer">
        <NavBar />
        <Grid container className="GridContainer" spacing={0}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="GridItem">
            <Paper className="OwnerAgentPaper">
              <Owner ownerWallet={this.props.ownerWallet}/>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="GridItem">

            <Paper className="SecondaryAgentPaper">
              <Government />
            </Paper>

            <Paper className="SecondaryAgentPaper">
              <SmartAgency />
            </Paper>

            <Paper className="SecondaryAgentPaper LandlordSection">
              <LandLord />
            </Paper>

          </Grid>
        </Grid>
        <UserTips />
      </div>
    );
  }

}

export default Dashboard;
