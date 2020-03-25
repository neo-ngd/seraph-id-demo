import { useReducer, Dispatch, useContext, useEffect } from 'react';
import { GlobalContext } from './GlobalContext';
import { changeAction, nextTip } from './action';

type CombinedReducers = {
    [index: string]: ReturnType<typeof useReducer>;
}

export function useCombinedReducers<T extends CombinedReducers, K extends keyof T>(combinedReducers: T): [{
    [P in K]: T[P][0]
}, Dispatch<any>] {
    const state: {
        [P in K]: T[P][0]
    } = Object.keys(combinedReducers).reduce((acc, key) => ({
        ...acc,
        [key]: combinedReducers[key][0]
    }), {} as {
        [P in K]: T[P][0]
    })
    const dispatch = (action: any) => Object.values(combinedReducers).map(value => value[1]).forEach(fn => fn(action));
    return [state, dispatch];
}

export function useStepActions() {
    const { dispatch } = useContext(GlobalContext);
    function _changeAction(agent: string, newContext: string) {
        dispatch(changeAction(agent, newContext));
    }

    function _nextTip(newTip: string) {
        dispatch(nextTip(newTip));
    }
    return {
        _changeAction,
        _nextTip
    }
}