import { Reducer } from "react";

export interface DialogState {
  open: boolean;
  title: string;
  code: string;
}

export const DialogInitialState: DialogState = {
  open: false,
  title: 'Default Title',
  code: 'code snippt'
}

export type DIALOG_ACTION_TYPE = 'OPEN' | 'CLOSE';

export interface DIALOG_ACTION {
  type: DIALOG_ACTION_TYPE;
  payload?: any;
}

export const dialogReducer: Reducer<DialogState, DIALOG_ACTION> = function(prevState, action) {
  const { type, payload = {} } = action;
  switch(type) {
    case 'OPEN': {
      const { title, code } = payload;
      return {
        title,
        code,
        open: true
      }
    }
    case 'CLOSE': {
      return {
        ...prevState,
        open: false
      }
    }
    default: {
      return prevState
    }
  }
}
  