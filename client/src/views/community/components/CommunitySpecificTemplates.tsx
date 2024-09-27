import { TemplateResponse, TemplateType } from '@/@types/community'
import { Card, Button, Dialog } from '@/components/ui'
import {
    apiGetCommunityTemplates,
    apiGetDefaultTemplate,
} from '@/services/CommunityService'
import React, { useEffect, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import Template from './Template'
import AddTemplateForm from './AddTemplateForm'
import { useDispatch } from 'react-redux'
import {
    toggleFetchTrigger,
    toggleTemplateDialog,
} from '@/store/slices/community'
import { useAppSelector, RootState } from '@/store'
import { useParams } from 'react-router-dom'

export default function CommunitySpecificTemplates() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [defaultTemplate, setDefaultTemplate] = useState<TemplateType>()
    const [templates, setTemplates] = useState<TemplateResponse[]>([])
    const isDialogOpen = useAppSelector(
        (state: RootState) => state.community.template.templateDialogOpen
    )

    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const postId = useParams<{ id: string }>().id

    useEffect(() => {
        if (postId) {
            setIsOpen(true)
        }
    }, [postId])

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const templates = await apiGetCommunityTemplates(
                    String(postId) ?? ''
                )
                if (templates.status === 200) {
                    setTemplates(templates.data as TemplateResponse[])
                }
                // fetch templates data
                console.log('fetching templates')
            } catch (error) {
                console.error('Error fetching templates', error)
            }
        }

        const fetchDefaultTemplate = async () => {
            try {
                const defaultTemplate = await apiGetDefaultTemplate()
                if (defaultTemplate.status === 200) {
                    setDefaultTemplate(defaultTemplate.data as TemplateType)
                }
                // fetch default templates data
                console.log('fetching default templates')
            } catch (error) {
                console.error('Error fetching default templates', error)
            }
        }

        if (postId) {
            fetchTemplates()
        } else {
            fetchDefaultTemplate()
        }
    }, [fetchTrigger])

    const handleToggle = () => {
        dispatch(toggleTemplateDialog())
        dispatch(toggleFetchTrigger())
    }

    return (
        <div>
            <Card className="min-w-[320px] md:min-w-[450px]" bodyClass="md:p-4">
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
                            <HiChevronDown
                                size="30"
                                className="mr-3 transform"
                            />
                        )}
                        <div className="text-gray">
                            Community Specific Templates
                        </div>
                    </div>

                    <div className="add-template self-end">
                        <Button
                            variant="twoTone"
                            type="submit"
                            onClick={handleToggle}
                        >
                            Add Template
                        </Button>
                    </div>
                </div>
                {isOpen && !!postId && (
                    <div className="body">
                        {templates.map((item) => (
                            <div key={item.id}>
                                <Template template={item.template} />
                            </div>
                        ))}
                    </div>
                )}

                {!isOpen && defaultTemplate && (
                    <Template template={defaultTemplate} />
                )}
                <Dialog isOpen={isDialogOpen ?? false} onClose={handleToggle}>
                    <h5 className="mb-4">Add Template</h5>
                    <AddTemplateForm />
                </Dialog>
            </Card>
        </div>
    )
}
