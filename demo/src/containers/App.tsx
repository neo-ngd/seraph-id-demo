// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React from 'react';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { ApplicationContext, initialActions, initialTip } from '../application-context';
import Dashboard from './Dashboard/Dashboard';
import HelpPage from './HelpPage/HelpPage';
import GovernmentPage from './GovernmentPage/GovernmentPage';
import AccommodationDapp from './AccommodationDapp/AccommodationDapp';

// Import from seraph-id-sdk 
import { SeraphIDWallet } from '@sbc/seraph-id-sdk';


interface Props { }

interface State {
  afterReset: boolean,
  tip: string
  showHelp: boolean,
  actions: any;
  passportClaim: any;
  accessKeyClaim: any;
  changeAction: any;
  nextTip: any;
  resetContext: any;
  contract: any,
  ownerWallet: any
}

export class App extends React.Component<Props, State> {
  public state: State = {
    afterReset: false,
    tip: initialTip,
    showHelp: false,
    actions: {},
    passportClaim: null,
    accessKeyClaim: null,
    changeAction: null,
    nextTip: null,
    resetContext: null,
    contract: null,
    ownerWallet: null
  };

  componentDidMount() {

    const ownerWallet = new SeraphIDWallet({ name: "ownerWallet" });
    this.setState({ ownerWallet: ownerWallet });

    const actions = initialActions;
    const actionEntries = Object.entries(actions);

    for (let actionEntry of actionEntries) {
      const storedAction = localStorage.getItem(actionEntry[0]);
      if (storedAction) {
        actionEntry[1] = storedAction;
      }
    }
    const storedActions = Object.assign({}, ...Array.from(actionEntries, ([k, v]) => ({ [k]: v })));

    const storedTip = localStorage.getItem('tip');
    let tip = initialTip;
    if (storedTip) {
      tip = storedTip;
    }

    this.setState({
      afterReset: false,
      tip: tip,
      actions: storedActions,
      passportClaim: null,
      accessKeyClaim: null,
      changeAction: this.changeAction,
      nextTip: this.nextTip,
      resetContext: this.resetContext
    });
  }

  changeAction = (agent: string, newContext: string) => {

    localStorage.setItem(agent, newContext);
    const stateCopy = { ...this.state };
    const newActions = stateCopy.actions;
    newActions[agent] = newContext;
    this.setState({ actions: newActions });
  };

  nextTip = (newTip: string) => {

    localStorage.setItem('tip', newTip);
    this.setState({ tip: newTip });
  };

  resetContext = (afterReset: boolean) => {
    this.setState({ afterReset: afterReset });
  }

  public render() {

    return (
      <BrowserRouter>

        <MuiThemeProvider theme={theme}>
          <ApplicationContext.Provider value={this.state}>

            <Switch>
              <Route path="/" exact render={() => <HelpPage help={false} afterReset={false} />} />
              <Route path="/help" exact render={() => <HelpPage help={true} afterReset={this.state.afterReset} />} />
              <Route path="/dashboard" exact render={() => <Dashboard ownerWallet={this.state.ownerWallet} />} />
              <Route path="/government" exact render={() => <GovernmentPage ownerWallet={this.state.ownerWallet} isAdmin={false} />} />
              <Route path="/governmentAdmin" exact render={() => <GovernmentPage ownerWallet={this.state.ownerWallet} isAdmin={true} />} />
              <Route path="/accommodation" exact render={() => <AccommodationDapp ownerWallet={this.state.ownerWallet} isAdmin={false} />} />
              <Route path="/accommodationAdmin" exact render={() => <AccommodationDapp ownerWallet={this.state.ownerWallet} isAdmin={true} />} />
            </Switch>

          </ApplicationContext.Provider>
        </MuiThemeProvider>

      </BrowserRouter>
    );
  }
}

export default App;


export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#58BF00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#405A94',
      main: '#2d4a89',
      contrastText: '#FFFFFF',
    },
    error: {
      light: '#F9A698',
      main: '#f45c42',
      contrastText: '#FFFFFF',
    },
  },
  overrides: {
    MuiSnackbarContent: {
      root: {
        maxWidth: '100vw !important',
        minWidth: 'max-content !important',
        boxSizing: 'border-box',
        backgroundColor: '#ff9602',
        borderRadius: '30px !important',
        color: 'white',
        textAlign: 'center',
        fontSize: '13pt'
      }
    },
    MuiFab: {
      primary: {
        background: 'linear-gradient(120deg, #58bf00, #58bf00, #a4dc00 60%, #b5e200)',
        color: '#FFFFFF',
      },
      root: {
        height: '40px !important',
      }
    },
    MuiInputLabel: {
      root: {
        "&$focused": {
          "color": "#2d4a89 !important"
        }
      },
      error: {
        "&$focused": {
          "color": "red !important"
        }
      }
    },
    MuiInput: {
      underline: {
        '&:after': {
          borderBottom: '2px solid #2d4a89',
        },
      }
    }
  }
});

