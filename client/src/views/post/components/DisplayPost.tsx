// src/post/components/DisplayPost.tsx
import { CommentResponseType, PostData, _Field } from '@/@types/post'
import { ActionLink } from '@/components/shared'
import { Button, Card, Dropdown, Input, Tag } from '@/components/ui'
import {
    apiDeletePost,
    apiGetComments,
    apiLikePost,
    apiPostComment,
} from '@/services/PostService'
import { toggleFetchTrigger, useAppSelector } from '@/store'
import { formatDate } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { FaCommentAlt } from 'react-icons/fa'
import {
    HiOutlineThumbUp,
    HiThumbUp,
    HiUserGroup,
    HiWifi,
} from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Comment from './Comment'
import { useEffect, useState } from 'react'
import useFetchData from '@/utils/hooks/useFetchData'
import { AxiosResponse } from 'axios'
import RenderField from './RenderField'
import RenderGeo from './RenderGeo'
import { String, startCase, toLower } from 'lodash'
import Menu from '@/components/ui/Menu'
import { CgMore, CgMoreVertical, CgMoreVerticalO } from 'react-icons/cg'

export default function DisplayPost({
    post,
    detailed = false,
    showCommunityName = true, // New prop with a default value
}: {
    post: PostData
    detailed?: boolean
    showCommunityName?: boolean // Add type for new prop
}) {
    const [comment, setComment] = useState('')
    const [showComment, setShowComment] = useState(true)
    const [showComments, setShowComments] = useState(showComment && detailed)
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )
    const { user, content, community, created_at, id, likes, is_liked } = post
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userId = useAppSelector((state) => state.auth.user.id)

    const comments = useFetchData(apiGetComments, [id]) as AxiosResponse

    const handleClick = (event: React.MouseEvent) => {
        // event.preventDefault()
        navigate(`/post/${id}`)
    }

    const [handleLike, isLiking] = useRequestWithNotification(
        apiLikePost,
        'Action successful!',
        'Action failed!',
        () => dispatch(toggleFetchTrigger()),
        false
    )

    const [handleDelete, isDeleting] = useRequestWithNotification(
        apiDeletePost,
        'Action successful!',
        'Action failed!',
        () => {
            navigate('/')
        }
    )

    useEffect(() => {
        setShowComments(showComment && detailed)
    }, [showComment, detailed])

    useEffect(() => {
        setComment('')
    }, [fetchTrigger])

    const [handleComment, isCommenting] = useRequestWithNotification(
        apiPostComment,
        'Comment posted successfully!',
        'Error posting comment!',
        () => dispatch(toggleFetchTrigger())
    )

    const handleCommunityNavigate = () => {
        navigate(`/community/${community.id}/details`)
    }

    const highlevelNavigate = !detailed ? handleClick : undefined

    const Toggle = <CgMoreVerticalO></CgMoreVerticalO>

    return (
        <div className="mb-8">
            {' '}
            {/* Add margin between posts */}
            <Card className="mt-3" bodyClass="cursor-pointer">
                <div className="header justify-between">
                    {content && content.length > 0 && (
                        <h3 onClick={highlevelNavigate}>
                            {content[0]?.field_value || 'No Title'}
                        </h3>
                    )}
                    {showCommunityName && (
                        <div
                            className="flex items-center"
                            onClick={handleCommunityNavigate}
                        >
                            <p className="mr-3">{community.name}</p>
                            <HiUserGroup />
                        </div>
                    )}
                </div>
                <div className="body mt-5 mb-5" onClick={highlevelNavigate}>
                    {detailed && (
                        <div className="mt-5">
                            {content?.map((item: _Field) => {
                                // Exclude the title field
                                if (item.field_name.toLowerCase() === 'title')
                                    return null

                                // For geolocation fields, handle separately
                                if (item.field_type === 'geolocation') {
                                    let coordinates
                                    try {
                                        coordinates = JSON.parse(
                                            item.field_value
                                        )
                                    } catch (error) {
                                        console.error(
                                            'Error parsing Coordinates: ',
                                            error
                                        )
                                        coordinates = [40.7371776, 31.5850752] //this will be the default values (Istanbul)
                                    }

                                    return (
                                        <RenderGeo
                                            key={item.field_name}
                                            coordinates={coordinates}
                                        />
                                    )
                                }

                                // Render field name and value inline
                                return (
                                    <div
                                        key={item.field_name}
                                        className={
                                            detailed
                                                ? 'block'
                                                : 'flex items-center'
                                        }
                                    >
                                        <strong>
                                            {startCase(
                                                toLower(item.field_name)
                                            )}
                                            :{' '}
                                        </strong>
                                        <span className="ml-2">
                                            <RenderField field={item} />
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Tags Section */}
                {post.tags && post.tags.length > 0 && (
                    <div
                        className="tags-section mt-3"
                        onClick={highlevelNavigate}
                    >
                        <strong>Tags:</strong>
                        <span className="ml-2">
                            {post.tags.map((tag, index) => (
                                <span key={index}>
                                    <Tag className="mr-1">{tag}</Tag>
                                </span>
                            ))}
                        </span>
                    </div>
                )}

                <div className="footer flex flex-col md:flex-row justify-between">
                    <p>
                        Posted by
                        {detailed ? (
                            <ActionLink
                                to={`/profile/${user.id}`}
                                className="italic mr-2"
                            >
                                {' ' + user.firstname + ' ' + user.lastname}
                            </ActionLink>
                        ) : (
                            <span className="italic mr-2">
                                {' ' + user.firstname + ' ' + user.lastname}
                            </span>
                        )}
                        at{' '}
                        <span className="underline">
                            {' '}
                            {formatDate(created_at)}
                        </span>
                    </p>
                    <div className="flex items-end mt-2 md:mt-0">
                        <div
                            className="comments flex items-center justify-between mr-5"
                            onClick={highlevelNavigate}
                        >
                            <FaCommentAlt
                                className=""
                                size={20}
                                onClick={() => {
                                    setShowComment(!showComment)
                                }}
                            />
                            <p>
                                ({(comments && comments.data.length) ?? null})
                            </p>
                        </div>
                        <div className="likes flex items-center justify-between">
                            {is_liked ? (
                                <HiThumbUp
                                    className=""
                                    size={25}
                                    onClick={() => {
                                        if (typeof handleLike === 'function') {
                                            handleLike(userId, id)
                                        }
                                    }}
                                />
                            ) : (
                                <HiOutlineThumbUp
                                    className=""
                                    size={25}
                                    onClick={() => {
                                        if (typeof handleLike === 'function') {
                                            handleLike(userId, id)
                                        }
                                    }}
                                />
                            )}
                            <p>{`(${likes})`}</p>
                        </div>

                        <Dropdown
                            renderTitle={
                                <CgMoreVerticalO
                                    size={20}
                                    className="items-end mx-2"
                                    style={{
                                        height: '25px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                />
                            }
                            className="hello"
                            placement="bottom-end"
                        >
                            <Dropdown.Item
                                eventKey="a"
                                onClick={() =>
                                    navigate(
                                        `/community/${community.id}/create-report/?post_id=${id}`
                                    )
                                }
                            >
                                Report
                            </Dropdown.Item>
                            {typeof handleDelete === 'function' && (
                                <Dropdown.Item
                                    onClick={() => {
                                        handleDelete(id)
                                    }}
                                    disabled={userId !== user.id}
                                >
                                    Delete
                                </Dropdown.Item>
                            )}
                        </Dropdown>
                    </div>
                </div>
            </Card>
            {detailed && (
                <div className="comment-action ml-5 mt-2">
                    <Input
                        type="text"
                        autoComplete="off"
                        name="comment"
                        placeholder="Enter your comment here..."
                        textArea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        onClick={() => {
                            typeof handleComment === 'function' &&
                                handleComment(id, userId, comment)
                            setShowComments(true)
                        }}
                        disabled={isCommenting || !comment ? true : undefined}
                    >
                        Comment
                    </Button>
                </div>
            )}
            {showComments &&
                comments?.data &&
                comments?.data.map((item: CommentResponseType) => {
                    return <Comment comment={item} />
                })}
        </div>
    )
}
