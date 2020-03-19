import { SeraphIDWallet } from "@sbc/seraph-id-sdk";
import { initialTip, initialActions } from "application-context";
import { Reducer, createContext, useReducer } from "react";

export interface State {
  tip: string;
  showHelp: boolean;
  actions: any;
  passportClaim: any;
  accessKeyClaim: any;
  contract?: string;
  ownerWallet?: SeraphIDWallet;
}

export const InitialState: State = {
  tip: initialTip,
  showHelp: false,
  actions: initialActions,
  passportClaim: null,
  accessKeyClaim: null
}

export type ACTION_TYPE = 'CHANGE_ACTION' | 'NEXT_TIP' | 'RESET_CONTEXT';

export interface ACTION {
  type: ACTION_TYPE;
  payload?: any;
}

export function init(initialState: State) {
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

export const reducer: Reducer<State, ACTION> = function(prevState, action) {
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
        tip: newTip
      }
    }
    case 'RESET_CONTEXT': {
      localStorage.removeItem('gender');
      return {
        ...InitialState,
        ownerWallet: new SeraphIDWallet({ name: "ownerWallet" })
      }
    }
    default: 
      throw new Error('Unkown Action Type');
  }
}
  