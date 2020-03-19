import { ACTION } from "./reducer"

export function changeAction(agent: string, newContext: string): ACTION {
    return {
        type: 'CHANGE_ACTION',
        payload: {
            agent,
            newContext
        }
    }
}

export function nextTip(newTip: string): ACTION {
    return {
        type: 'NEXT_TIP',
        payload: {
            newTip
        }
    }
}