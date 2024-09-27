import { combineReducers } from '@reduxjs/toolkit'
import template from './templateSlice'
import community from './communitySlice'
import { TemplateType } from '@/@types/community'

const reducer = combineReducers({
    template,
    community,
})

export type CommunityState = {
    template: TemplateType
    community: TemplateType
}

export * from './templateSlice'
export * from './communitySlice'

export default reducer
