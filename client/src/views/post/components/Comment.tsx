import { CommentResponseType } from '@/@types/post'
import { ActionLink } from '@/components/shared'
import { Button, Card } from '@/components/ui'
import { apiRemoveComment } from '@/services/PostService'
import { toggleFetchTrigger, useAppSelector } from '@/store'
import { formatDate, truncateText } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Comment({ comment }: { comment: CommentResponseType }) {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const userId = useAppSelector((state) => state.auth.user.id)
    const dispatch = useDispatch()

    const [handleRemove, isRemoving] = useRequestWithNotification(
        apiRemoveComment,
        'Comment removed successfully!',
        'Error removing comment!',
        () => dispatch(toggleFetchTrigger())
    )

    return (
        <Card
            className="min-w-[320px] md:min-w-[450px] mt-3 ml-5"
            bodyClass="md:p-4"
        >
            <div className="flex justify-between items-center header">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                >
                    {isOpen ? (
                        <HiChevronDown
                            size="30"
                            className="mr-3 transform rotate-180"
                        />
                    ) : (
                        <HiChevronDown size="30" className="mr-3 transform" />
                    )}
                    <div className="text-gray">
                        {truncateText(comment.content, 50)}
                    </div>
                </div>
                <div className="flex">
                    <ActionLink
                        className="mr-2 cursor-pointer"
                        onClick={() => {
                            navigate(`/profile/${comment.user.id}`)
                        }}
                    >
                        {comment.user.firstname} {comment.user.lastname}
                    </ActionLink>
                    <p>{formatDate(comment.created_at)}</p>
                </div>
            </div>
            {isOpen && (
                <div className="body">{<div>{comment.content}</div>}</div>
            )}
            {isOpen && comment.user.id === userId && (
                <div className="footer mt-5">
                    <Button
                        className="text-red-500"
                        onClick={() => {
                            if (typeof handleRemove === 'function') {
                                handleRemove(comment.id)
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            )}
        </Card>
    )
}
