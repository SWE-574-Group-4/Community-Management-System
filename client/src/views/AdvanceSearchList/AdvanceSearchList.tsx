import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import AdvanceSearchTable from './components/AdvanceSearchTable'
import AdvanceSearchTableTools from './components/AdvanceSearchTableTools'

injectReducer('advanceSearchList', reducer)

const AdvanceSearchList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Advance Community Search</h3>
                <AdvanceSearchTableTools />
            </div>
            <AdvanceSearchTable />
        </AdaptableCard>
    )
}

export default AdvanceSearchList
