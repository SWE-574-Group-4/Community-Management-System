
import Tag from '@/components/ui/Tag'
import React, { useEffect } from 'react'
import { HiPlusCircle, HiX } from 'react-icons/hi'

interface TagComponentProps {
    tags: string[];
}

const TagComponent: React.FC<TagComponentProps> = ({tags}) => {
    return (
        <div className="flex">
            {tags.length > 0 ? (
                tags.map((tag) => (
                    <div className="mr-2 rtl:ml-2" key={tag}>
                        <Tag prefix prefixClass="bg-emerald-500">
                            {tag}
                        </Tag>
                    </div>
                ))
            ) : (
                <div>No tags available</div>
            )}
        </div>
    )
}

export default TagComponent

