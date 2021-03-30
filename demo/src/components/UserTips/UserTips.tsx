// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import './UserTips.css';
import { Snackbar } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { ApplicationContext } from '../../application-context';

interface Props {
    location?: string
}
interface State {
    open: boolean;
}


export class UserTips extends React.Component<Props, State> {

    public state: State = {
        open: true
    };

    handleClose = () => {
        this.setState({ open: false });
    }

    public render() {

        return (
            <ApplicationContext.Consumer>
                {(value: any) => (
                    <Snackbar
                        onClick={this.handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={this.state.open}
                        message={
                            <span
                                className="UserTipContent">
                                <InfoIcon className="TipInfoIcon" />
                                {value.tip}
                            </span>
                        }
                    />
                )}
            </ApplicationContext.Consumer>
        );

    }

}

export default UserTips;
