import { _Field } from '@/@types/post'

export default function RenderField({ field }: { field: _Field }) {
    console.log(field)
    return (
        <div>
            {field.field_name !== 'title' && field.field_type === 'text' && (
                <p>{field.field_value}</p>
            )}
            {field.field_type === 'textarea' && <p>{field.field_value}</p>}
            {field.field_type === 'image' && (
                <img src={field.field_value} alt="Image" />
            )}
            {field.field_type === 'video' && (
                <video src={field.field_value} controls />
            )}
            {field.field_type === 'date' && <p>{field.field_value}</p>}
            {field.field_type === 'geolocation' && <p>{field.field_value}</p>}
            {field.field_type === 'number' && <p>{field.field_value}</p>}
        </div>
    )
}
