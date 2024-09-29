import { toSentenceCase } from '@/utils/helpers'
import { FieldType } from '@/@types/community'

export default function MapField({ fields }: { fields: FieldType[] }) {
    return (
        <div>
            <div className="flex underline text-gray font-bold mt-2">
                <div className="mr-2 w-2/6">Field Name</div>
                <div className="mr-2 w-2/6">Field Type</div>
                <div>Required</div>
            </div>

            {fields.map((field, index) => (
                <div key={index} className="flex">
                    <div className="mr-2 w-2/6">
                        {toSentenceCase(field.field_name)}
                    </div>
                    <div className="mr-2 w-2/6">
                        {toSentenceCase(field.field_type)}
                    </div>
                    <div>{field.isRequired ? 'Yes' : 'No'}</div>
                </div>
            ))}
        </div>
    )
}
