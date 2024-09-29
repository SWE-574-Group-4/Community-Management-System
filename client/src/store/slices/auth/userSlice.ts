import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { UserResponseType } from '@/@types/user'

const initialState: UserResponseType = {
    id: -1,
    country: '',
    dob: '',
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    short_bio: '',
    username: '',
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserResponseType>) {
            // Use immer's draft syntax to modify the state
            Object.assign(state, action.payload)
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
