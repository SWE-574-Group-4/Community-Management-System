import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { FieldType, TemplateType } from '@/@types/community'

const initialState: TemplateType = {
    name: '',
    description: '',
    fields: [
        {
            field_name: '',
            field_type: '',
            isRequired: false,
        },
    ],
    templateDialogOpen: false,
}

const templateSlice = createSlice({
    name: `${SLICE_BASE_NAME}/template`,
    initialState,
    reducers: {
        setTemplate(state, action: PayloadAction<TemplateType>) {
            Object.assign(state, action.payload)
        },

        addTemplate(
            state,
            action: PayloadAction<{
                templateName: string
                templateDescription: string
                fields: FieldType[]
            }>
        ) {
            const { templateName, templateDescription, fields } = action.payload
            console.log(templateName, templateDescription, fields)
            state.name = templateName
            state.description = templateDescription
            state.fields = fields
        },
        toggleTemplateDialog(state) {
            state.templateDialogOpen = !state.templateDialogOpen
        },
    },
})

export const { setTemplate, addTemplate, toggleTemplateDialog } =
    templateSlice.actions
export default templateSlice.reducer
