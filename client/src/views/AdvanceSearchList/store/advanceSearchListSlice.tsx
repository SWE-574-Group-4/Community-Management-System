import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiAdvanceSearch } from '@/services/SearchService'
import type { TableQueries } from '@/@types/common'

type AdvanceSearch = {
    id: string
    name: string
    advanceSearchCode: string
    img: string
    dataTypes: string
    price: number
    stock: number
    status: number
}

type AdvanceSearchList = AdvanceSearch[]

type GetAdvanceSearchResponse = {
    data: AdvanceSearch
    total: number
}

type FilterQueries = {
    name: string
    dataTypes: string[]
    search_type: number
}

export type AdvanceSearchListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedAdvanceSearch: string
    tableData: TableQueries
    filterData: FilterQueries
    advanceSearchList: AdvanceSearch[]
}

type GetAdvanceSearchRequest = TableQueries & {
    filterData?: FilterQueries
}

export const SLICE_NAME = 'advanceSearchList'

export const getAdvanceSearch = createAsyncThunk(
    SLICE_NAME + '/getAdvanceSearch',
    async (data: GetAdvanceSearchRequest, thunkAPI) => {
        const state = thunkAPI.getState() as {
            [SLICE_NAME]: AdvanceSearchListState
        }
        const filterData = state[SLICE_NAME].data.filterData

        const response = await apiAdvanceSearch<
            GetAdvanceSearchResponse,
            GetAdvanceSearchRequest & { filterData: FilterQueries }
        >({ ...data, filterData })

        return response.data
    }
)

export const deleteAdvanceSearch = createAsyncThunk(
    SLICE_NAME + '/deleteAdvanceSearch',
    async (id: string) => {
        console.log('id', id)
    }
)

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

const initialState: AdvanceSearchListState = {
    loading: false,
    deleteConfirmation: false,
    selectedAdvanceSearch: '',
    advanceSearchList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        dataTypes: [],
        search_type: 0,
    },
}

const advanceSearchListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateAdvanceSearchList: (state, action) => {
            state.advanceSearchList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedAdvanceSearch: (state, action) => {
            state.selectedAdvanceSearch = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdvanceSearch.fulfilled, (state, action) => {
                state.advanceSearchList = action.payload.data // Wrap action.payload.data in an array
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getAdvanceSearch.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateAdvanceSearchList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedAdvanceSearch,
} = advanceSearchListSlice.actions

export default advanceSearchListSlice.reducer
