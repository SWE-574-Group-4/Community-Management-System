import { useEffect, useRef, useState } from 'react'
import IngredientTableSearch from '../account/Settings/components/Ingredients/components/IngredientTableSearch'
import { SearchType } from '@/@types/search'
import { Button, Card } from '@/components/ui'
import { UserResponseType } from '@/@types/user'
import {
    apiFetchNonMembers,
    apiSendInvitation,
} from '@/services/CommunityService'
import { useParams } from 'react-router-dom'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useDispatch } from 'react-redux'
import { toggleFetchTrigger, useAppSelector } from '@/store'

const Invite = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [data, setData] = useState<any>(null)
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const { id } = useParams<{ id: string }>()
    const dispatch = useDispatch()

    const [handleSendInvitation, isInviting] = useRequestWithNotification(
        apiSendInvitation,
        'You have successfully sent invitation!',
        'Error sending invitation!',
        () => dispatch(toggleFetchTrigger())
    )

    const handleInputChange = async (val: string) => {
        const query = val

        try {
            const response = await apiFetchNonMembers(id ?? '', query)
            console.log('response', response.data)
            setData(response.data as SearchType)
            // Handle the response data here
        } catch (error) {
            // Handle any errors here
        }
    }

    useEffect(() => {
        handleInputChange(inputRef.current?.value ?? '')
    }, [fetchTrigger])

    return (
        <div className="">
            <IngredientTableSearch
                ref={inputRef}
                onInputChange={handleInputChange}
            />
            {data &&
                inputRef.current !== null &&
                inputRef.current.value !== '' && (
                    <Card>
                        <h5>Users:</h5>
                        {data.map((user: UserResponseType) => {
                            const {
                                firstname,
                                lastname,
                                username,
                                is_invited,
                            } = user
                            return (
                                <div key={user.id} className="mt-5">
                                    <p>
                                        {firstname} {lastname}{' '}
                                        <span className="ml-5 italic">
                                            {username}
                                        </span>
                                        <Button
                                            disabled={is_invited}
                                            className="bg-blue-500 text-white ml-5"
                                            size="xs"
                                            variant="solid"
                                            onClick={() => {
                                                if (
                                                    typeof handleSendInvitation ===
                                                    'function'
                                                ) {
                                                    handleSendInvitation(
                                                        id,
                                                        user.id
                                                    )
                                                }
                                            }}
                                        >
                                            {is_invited ? 'Invited' : 'Invite'}
                                        </Button>
                                    </p>
                                </div>
                            )
                        })}
                    </Card>
                )}
        </div>
    )
}

export default Invite
