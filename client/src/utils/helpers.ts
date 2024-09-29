import { _Field } from '@/@types/post'
import dayjs from 'dayjs'

export function toSentenceCase(str: String) {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatDate = (date: string, format?: string) =>
    dayjs(date).format(format ?? 'MMMM DD, YYYY HH:mm')

export const mapRoleToLabel = (role: number) => {
    switch (role) {
        case -1:
            return 'Owner'
        case 1:
            return 'Moderator'
        default:
            return 'Member'
    }
}

export const truncateText = (text: string, maxLength: number) => {
    if (!text) return text

    if (text.length <= maxLength) {
        return text
    } else {
        return text.slice(0, maxLength) + '...'
    }
}

export const defaultTemplate = () => {
    return [
        {
            field_name: 'title',
            field_type: 'text',
            isRequired: true,
        },
        {
            field_name: 'description',
            field_type: 'textarea',
            isRequired: false,
        },
    ]
}

export const extractTitleAndDescription = (content: _Field[]) => {
    let result = {
        title: '',
        description: '',
    }

    if (!content) return result

    content.forEach((item) => {
        if (item.field_name === 'title') {
            result.title = item.field_value ?? ''
        } else if (item.field_name === 'description') {
            result.description = item.field_value ?? ''
        }
    })

    return result
}
