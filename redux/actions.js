export const SET_DIU = 'SET_DIU';

export const setDiu = diu => dispatch => {
    dispatch({
        type: SET_DIU,
        payload: diu,
    });
};