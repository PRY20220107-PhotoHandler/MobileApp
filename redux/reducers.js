import { SET_DIU } from "./actions";

const initialState = {
    diu: '',
}

function userReducer(state , action) {
    if (action.type === SET_DIU) {
        return { ...state, diu: action.payload };
    }
    else {return initialState;}
}

export default userReducer;