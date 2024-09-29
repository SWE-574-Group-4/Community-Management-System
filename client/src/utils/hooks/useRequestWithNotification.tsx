import { useState } from 'react'
import { Notification, toast } from '@/components/ui'

function useRequestWithNotification(
    requestFunc: any,
    successMessage: any,
    errorMessage: any,
    successCallback: any,
    notificationAllowed: boolean = true
) {
    const [isLoading, setIsLoading] = useState(false)

    const runRequest = async (...params: any[]) => {
        setIsLoading(true)
        try {
            const resp = await requestFunc(...params)
            if (resp.status === 200) {
                if (notificationAllowed) {
                    toast.push(
                        <Notification title={successMessage} type="success" />,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            }
            successCallback()
        } catch (error) {
            console.error(errorMessage, error)
            if (notificationAllowed) {
                toast.push(
                    <Notification title={errorMessage} type="danger" />,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } finally {
            setIsLoading(false)
        }
    }

    return [runRequest, isLoading]
}

export default useRequestWithNotification
