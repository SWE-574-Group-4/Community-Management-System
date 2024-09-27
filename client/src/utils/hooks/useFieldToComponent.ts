import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import TextArea from '@/components/ui/TextArea'

const useFieldToComponent = (fieldType: string) => {
    const [Component, setComponent] = useState<React.ComponentType<any> | null>(
        null
    )

    useEffect(() => {
        const componentMap: { [key: string]: React.ComponentType<any> } = {
            text: Input,
            number: Input,
            textarea: TextArea,
            image: Input,
            geolocation: Input,
        }

        setComponent(componentMap[fieldType] || Input)
    }, [fieldType])

    return Component
}

export default useFieldToComponent
