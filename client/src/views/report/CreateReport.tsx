import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from '@/components/ui/toast';
import Select from '@/components/ui/Select';
import Notification from '@/components/ui/Notification';
import Alert from '@/components/ui/Alert'; // Import Alert
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { apiCreateReport } from '@/services/ReportService';
import { useState } from 'react'; // Import useState

const REPORT_REASONS = [
    { value: 'SPAM', label: 'Spam' },
    { value: 'INAPPROPRIATE', label: 'Inappropriate Content' },
    { value: 'HARASSMENT', label: 'Harassment' },
    { value: 'DUPLICATE', label: 'Duplicate Content' },
    { value: 'MISLEADING', label: 'Misleading/Wrong Content' },
    { value: 'OTHER', label: 'Other' },
];

const CreateReport = () => {
    const { community_id: communityId } = useParams<{ community_id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    const searchParams = new URLSearchParams(location.search);
    const postId = searchParams.get('post_id');
    const commentId = searchParams.get('comment_id');

    const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

    const validationSchema = Yup.object().shape({
        reason: Yup.string().required('Reason is required'),
        comment_text: Yup.string()
            .max(250, 'Additional Comments cannot exceed 250 characters')
            .nullable(),
    });

    const initialValues = {
        reason: '',
        comment_text: '',
    };

    const onSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        setSubmitting(true);
        try {
            const data = {
                ...values,
                post_id: postId,
                comment_id: commentId,
                user_id: user?.id,
                status: 0,
            };
            await apiCreateReport(Number(communityId), data);

            // Set success message
            toast.push(
                <Notification type="success">
                    Report Created
                </Notification>,
                { placement: 'top-center' }
            );

            // Redirect after a short delay
            setTimeout(() => navigate(`/post/${postId}`), 500);
        } catch (error: any) {
            console.error('Error creating report:', error.response || error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-w-[280px] md:min-w-[360px] mt-3 mx-auto">
            {successMessage && ( // Show success alert if successMessage is set
                <Alert type="success" showIcon className="mb-4">
                    {successMessage}
                </Alert>
            )}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <FormContainer className="space-y-3">
                            <FormItem
                                label="Reason"
                                invalid={touched.reason && !!errors.reason}
                                errorMessage={errors.reason}
                                className="flex flex-col w-1/3"
                            >
                                <Field name="reason">
                                    {({ field, form }: any) => (
                                        <Select
                                            options={REPORT_REASONS}
                                            placeholder="Select a reason"
                                            className="w-full text-sm"
                                            value={
                                                REPORT_REASONS.find((option) => option.value === field.value) || null
                                            }
                                            onChange={(selectedOption) => {
                                                if (selectedOption) {
                                                    form.setFieldValue(field.name, selectedOption.value);
                                                }
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem
                                label="Additional Comments"
                                invalid={touched.comment_text && !!errors.comment_text}
                                errorMessage={errors.comment_text}
                                className="flex flex-col w-1/3"
                            >
                                <Field
                                        type="text"
                                        autoComplete="off"
                                        name="comment_text"
                                        placeholder="Description"
                                        textArea
                                        component={Input}
                                    />
                            </FormItem>

                            <div>
                                <Button
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"
                                    size="md"
                                >
                                    Submit
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateReport;
