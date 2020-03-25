import { SeraphIDWallet } from "@sbc/seraph-id-sdk";
import { initialTip, initialActions } from "application-context";
import { Reducer } from "react";

export interface DataState {
  tip: string;
  showTip: boolean;
  showHelp: boolean;
  actions: any;
  passportClaim: any;
  accessKeyClaim: any;
  contract?: string;
  ownerWallet?: SeraphIDWallet;
}

export const DataInitialState: DataState = {
  tip: initialTip,
  showTip: true,
  showHelp: false,
  actions: initialActions,
  passportClaim: null,
  accessKeyClaim: null
}

export type DATA_ACTION_TYPE = 'CHANGE_ACTION' | 'NEXT_TIP' | 'RESET_CONTEXT' | 'SHOW_TIP' | 'CLOSE_TIP';

export interface DATA_ACTION {
  type: DATA_ACTION_TYPE;
  payload?: any;
}

export function init(initialState: DataState) {
  const ownerWallet = new SeraphIDWallet({ name: "ownerWallet" });
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
  return {
    ...initialState,
    tip,
    actions: storedActions,
    passportClaim: null,
    accessKeyClaim: null,
    ownerWallet
  };
}

export const dataReducer: Reducer<DataState, DATA_ACTION> = function(prevState, action) {
  const { type, payload = {} } = action;
  switch(type) {
    case 'CHANGE_ACTION': {
      const { agent, newContext } = payload;
      localStorage.setItem(agent, newContext);
      return {
        ...prevState,
        actions: {
          ...prevState.actions,
          [agent]: newContext
        }
      }
    }
    case 'NEXT_TIP': {
      const { newTip } = payload;
      localStorage.setItem('tip', newTip);
      return {
        ...prevState,
        tip: newTip,
        showTip: true
      }
    }
    case 'RESET_CONTEXT': {
      localStorage.clear();
      return {
        ...DataInitialState,
        ownerWallet: new SeraphIDWallet({ name: "ownerWallet" })
      }
    }
    case 'CLOSE_TIP': {
      return {
        ...prevState,
        showTip: false
      }
    }
    case 'SHOW_TIP': {
      return {
        ...prevState,
        showTip: true
      }
    }
    default: 
      return prevState
  }
}
  