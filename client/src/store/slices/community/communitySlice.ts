import { createSlice } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { FetchCommunityType } from '@/@types/community'

const initialState: FetchCommunityType = {
    fetchTrigger: false,
}

const communitySlice = createSlice({
    name: `${SLICE_BASE_NAME}/community`,
    initialState,
    reducers: {
        toggleFetchTrigger(state) {
            state.fetchTrigger = !state.fetchTrigger
        },
    },
})

export const { toggleFetchTrigger } = communitySlice.actions
export default communitySlice.reducer
