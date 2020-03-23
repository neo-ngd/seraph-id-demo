import { useReducer, Dispatch } from 'react';

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