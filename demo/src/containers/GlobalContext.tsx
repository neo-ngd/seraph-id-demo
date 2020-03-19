import { useReducer, createContext, Dispatch } from "react";
import { InitialState, reducer, init, State, ACTION } from "./reducer";
import React from "react";

interface GlobalContextInterface {
    state: State;
    dispatch?: Dispatch<ACTION>;
}

interface Props {
    children: React.ReactElement;
}

export const GlobalContext = createContext<GlobalContextInterface>({
    state: InitialState
});

export function Global(props: Props) {
    const [state, dispatch] = useReducer(reducer, InitialState, init);
    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            {props.children}
        </GlobalContext.Provider>
    )
}