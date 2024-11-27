import { CommentResponseType } from '@/@types/post'
import { ActionLink } from '@/components/shared'
import { Button, Card, Dropdown } from '@/components/ui'
import { apiRemoveComment } from '@/services/PostService'
import { toggleFetchTrigger, useAppSelector } from '@/store'
import { formatDate, truncateText } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { set } from 'lodash'
import { useState } from 'react'
import { CgMoreVerticalO } from 'react-icons/cg'
import { HiChevronDown } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Comment({ comment }: { comment: CommentResponseType }) {
    const navigate = useNavigate()
    const userId = useAppSelector((state) => state.auth.user.id)
    const [showMore, setShowMore] = useState(false)
    const dispatch = useDispatch()

    const [handleRemove, isRemoving] = useRequestWithNotification(
        apiRemoveComment,
        'Comment removed successfully!',
        'Error removing comment!',
        () => dispatch(toggleFetchTrigger())
    )

    const handleReport = () => {
        navigate(
            `/community/${comment.community.id}/create-report?post_id=${comment.post}&comment_id=${comment.id}`
        )
    }

    const contentLengthBasedOnWidth = () => {
        if (window.innerWidth < 768) {
            return 200
        } else {
            return 500
        }
    }

    return (
        <Card
            className="min-w-[320px] md:min-w-[450px] mt-3 ml-5"
            bodyClass="md:p-4"
        >
            <div className="header text-xs font-semibold mb-2">
                {
                    <div className="flex items-center justify-between w-full">
                        <ActionLink to={`/profile/${comment?.user?.id}`}>
                            {comment.user.firstname} {comment.user.lastname} @
                            <span className="italic">
                                {comment.user.username}
                            </span>
                        </ActionLink>
                        <span className="">
                            {formatDate(comment.created_at)}
                        </span>
                    </div>
                }
            </div>
            <div className="body">
                {comment.content.length > contentLengthBasedOnWidth() &&
                !showMore ? (
                    <div>
                        {truncateText(
                            comment.content,
                            contentLengthBasedOnWidth()
                        )}
                        <Button
                            size="xs"
                            onClick={() => setShowMore(!showMore)}
                            className="ml-2"
                        >
                            See more
                        </Button>
                    </div>
                ) : (
                    <div>{comment.content}</div>
                )}
            </div>

            <div className="footer mt-5 flex justify-end">
                <>
                    <Dropdown
                        renderTitle={
                            <CgMoreVerticalO
                                size={20}
                                className="items-end cursor-pointer"
                                style={{
                                    height: '25px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />
                        }
                        placement="bottom-end"
                    >
                        <Dropdown.Item
                            eventKey="a"
                            onClick={() => {
                                if (typeof handleRemove === 'function') {
                                    handleRemove(comment.id)
                                }
                            }}
                            disabled={comment?.user?.id !== userId}
                        >
                            Delete
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="b" onClick={handleReport}>
                            Report
                        </Dropdown.Item>
                    </Dropdown>
                </>
            </div>
        </Card>
    )
}
