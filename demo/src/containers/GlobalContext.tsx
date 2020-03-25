import { useReducer, createContext, Dispatch } from "react";
import React from "react";
import { dataReducer, DataInitialState, init, DataState, DialogState, DialogInitialState, dialogReducer } from "../reducer";
import { ACTION } from "./action";
import { useCombinedReducers } from './hooks';

interface GlobalContextInterface {
    state: {
        data: DataState;
        dialog: DialogState;
    };
    dispatch: Dispatch<ACTION>;
}

interface Props {
    children: React.ReactElement | Array<React.ReactElement>;
}

export const GlobalContext = createContext<GlobalContextInterface>({
    state: {
        data: DataInitialState,
        dialog: DialogInitialState,
    },
    dispatch: (value: ACTION) => {}
});

export function Global(props: Props) {
    const [state, dispatch] = useCombinedReducers({
        data: useReducer(dataReducer, DataInitialState, init),
        dialog: useReducer(dialogReducer, DialogInitialState)
    })
    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            {props.children}
        </GlobalContext.Provider>
    )
}