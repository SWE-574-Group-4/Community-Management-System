import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import AdvanceSearchTableSearch from './AdvanceSearchTableSearch'
import AdvanceSearchFilter from './AdvanceSearchFilter'
import { Link } from 'react-router-dom'

const AdvanceSearchTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <AdvanceSearchTableSearch />
            <AdvanceSearchFilter />
            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/advanceSearch-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link>
            <Link
                className="block lg:inline-block md:mb-0 mb-4"
                to="/app/sales/advanceSearch-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Add Community
                </Button>
            </Link>
        </div>
    )
}

export default AdvanceSearchTableTools
