
import { ActionReducerMap } from '@ngrx/store';

// reducers
import * as fromUI from './redux/ui.reducer';


export interface AppState {
    ui: fromUI.State,
}

export const appReducer: ActionReducerMap<AppState> = {
    ui: fromUI.uiReducer,
}