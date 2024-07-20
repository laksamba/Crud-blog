import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: '',
    email: '',
    username: '',
    auth: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { _id, email, username, auth } = action.payload;

            state._id = _id;
            state.email = email;
            state.username = username;
            state.auth = auth;
        },
        resetUser: (state) => {
            state._id = '';
            state.email = '';
            state.username = '';
            state.auth = false;
        }
    }
});

// Export actions
export const { setUser, resetUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
