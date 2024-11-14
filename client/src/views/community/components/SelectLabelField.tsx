
import React from 'react'
import Select from '@/components/ui/Select'

const groupedOptions = [
    {
        label: 'Technology',
        options: [
            {value: 'ai', label: 'Artificial Intelligence'},
            {value: 'blockchain', label: 'Blockchain'},
            {value: 'cybersecurity', label: 'Cybersecurity'},
            {value: 'data-science', label: 'Data Science'},
            {value: 'iot', label: 'Internet of Things'},
            {value: 'ml', label: 'Machine Learning'},
            {value: 'quantum-computing', label: 'Quantum Computing'},
        ],
    },
    {
        label: 'Sports',
        options: [
            {value: 'basketball', label: 'Basketball'},
            {value: 'football', label: 'Football'},
            {value: 'tennis', label: 'Tennis'},
            {value: 'hockey', label: 'Hockey'},
        ],
    },
]

const formatGroupLabel = (data: any) => (
    <div className="font-bold text-xs uppercase text-gray-800 dark:text-white my-2">
        {data.label}
    </div>
)

const Group = () => {
    return (
        <div>
            <Select
                isMulti
                formatGroupLabel={formatGroupLabel}
                options={groupedOptions}
                placeholder="Select labels"
            />
        </div>
    )
}

export default Group

// const groupedOptions = [
//     {
//         label: 'Technology',
//         tags: [
//             'Artificial Intelligence',
//             'Blockchain',
//             'Cybersecurity',
//             'Data Science',
//             'Internet of Things',
//             'Machine Learning',
//             'Quantum Computing',
//         ],
//     },
//     {
//         label: 'Sports',
//         tags: [
//             'Baseball',
//             'Basketball',
//             'Cricket',
//             'Football',
//             'Golf',
//             'Hockey',
//             'Swimming'
//         ],
//     },
// ]