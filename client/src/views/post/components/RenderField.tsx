import { _Field } from '@/@types/post'

export default function RenderField({ field }: { field: _Field }) {
    console.log(field)
    return (
        <div>
            {field.field_name !== 'title' && field.field_type === 'text' && (
                <p>{field.field_value}</p>
            )}
            {field.field_type === 'textarea' && <p>{field.field_value}</p>}
            {field.field_type === 'image' && field.field_value !== '' && (
                <img
                    src={
                        'https://static.vecteezy.com/system/resources/previews/009/944/861/non_2x/any-question-label-template-design-vector.jpg'
                    }
                    alt="Image"
                    style={{ maxWidth: '400px' }}
                    className="rounded-lg"
                />
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
