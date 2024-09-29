import { Alert } from '../ui'

export default function NoData() {
    return (
        <Alert showIcon className="mb-4" type="info">
            No data available
        </Alert>
    )
}
