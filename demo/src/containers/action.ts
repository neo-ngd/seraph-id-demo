import { DATA_ACTION_TYPE, DIALOG_ACTION_TYPE } from "../reducer"

export interface ACTION {
   type:  DATA_ACTION_TYPE | DIALOG_ACTION_TYPE;
   payload?: any;
}

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

export function openDialog(code: string, title: string): ACTION {
    return {
        type: 'OPEN',
        payload: {
            code,
            title
        }
    }
}

export function closeDialog(): ACTION {
    return {
        type: 'CLOSE'
    }
}