import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteAdvanceSearch,
    getAdvanceSearch,
    useAppDispatch,
    useAppSelector,
} from '../store'

const AdvanceSearchDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.advanceSearchList.data.deleteConfirmation
    )
    const selectedAdvanceSearch = useAppSelector(
        (state) => state.advanceSearchList.data.selectedAdvanceSearch
    )
    const tableData = useAppSelector(
        (state) => state.advanceSearchList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        // const success = await deleteAdvanceSearch({ id: selectedAdvanceSearch })

        const success = true
        if (success) {
            dispatch(getAdvanceSearch(tableData))
            toast.push(
                <Notification
                    title={'Successfuly Deleted'}
                    type="success"
                    duration={2500}
                >
                    AdvanceSearch successfuly deleted
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title="Delete advanceSearch"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                Are you sure you want to delete this advanceSearch? All record
                related to this advanceSearch will be deleted as well. This
                action cannot be undone.
            </p>
        </ConfirmDialog>
    )
}

export default AdvanceSearchDeleteConfirmation
