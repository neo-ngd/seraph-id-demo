// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React from 'react';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Dashboard from './Dashboard/Dashboard';
import HelpPage from './HelpPage/HelpPage';
import GovernmentPage from './GovernmentPage/GovernmentPage';
import AccommodationDapp from './AccommodationDapp/AccommodationDapp';
import { Global } from './GlobalContext';
import { CodeDialog } from 'components/Dialog/CodeDialog';


export function App() {
  return (
    <Global>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <Switch>
            <Route path="/" exact render={() => <HelpPage help={false}/>} />
            <Route path="/help" exact render={() => <HelpPage help={true} />} />
            <Route path="/dashboard" exact render={() => <Dashboard />} />
            <Route path="/government" exact render={() => <GovernmentPage isAdmin={false} />} />
            <Route path="/governmentAdmin" exact render={() => <GovernmentPage isAdmin={true} />} />
            <Route path="/accommodation" exact render={() => <AccommodationDapp isAdmin={false} />} />
            <Route path="/accommodationAdmin" exact render={() => <AccommodationDapp isAdmin={true} />} />
          </Switch>
        </MuiThemeProvider>
      </BrowserRouter>
      <CodeDialog></CodeDialog>
    </Global>
  );
}


export default App;


export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
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

