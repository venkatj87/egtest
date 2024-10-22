import { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import { userLogin } from "../../utils/api";
import { saveItem } from "../../utils/storage";
import { __toString } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

interface LoginFields {
    email: string;
    password: string;
}

/**
 * Security Note:
 * Storing the access token in local storage is not secure, as it exposes the token to potential XSS attacks.
 * Consider more secure alternatives depending on the architecture of the frontend and backend:
 * - HTTP-only cookies for token storage to prevent client-side access.
 * - Session storage for short-lived tokens.
 * - Utilizing third-party authentication libraries (e.g., OAuth providers) for managing tokens securely.
 */
const LoginForm: React.FC = () => {
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    
    const handleLogin = async (values: LoginFields) => {
        try {
            const response = await userLogin(values.email, values.password);
            if (!response.data._id) {
                throw new Error('Invalid response from the server. Please try again.');
            }
            saveItem('user', response.data);
            navigate('/home');

        } catch (err: any) {
            const errorMessage = __toString(err?.response?.data?.message || 'An error occurred. Please try again.');
            setError(errorMessage);
        }
    };

    const formik = useFormik<LoginFields>({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: (values: LoginFields, { setSubmitting }: FormikHelpers<LoginFields>) => {
            setSubmitting(true);
            handleLogin(values).finally(() => setSubmitting(false));
        }
    });

    return (
        <div>
            {error && <h3>{error}</h3>}
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input 
                        type='email' 
                        id='email' 
                        name='email' 
                        placeholder='Enter your email'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        aria-invalid={formik.touched.email && formik.errors.email ? "true" : undefined}
                    />
                    {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type='password' 
                        id='password' 
                        name='password' 
                        placeholder='Enter your password'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        aria-invalid={formik.touched.password && formik.errors.password ? "true" : undefined}
                    />
                    {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
                </div>
                <button type='submit' disabled={formik.isSubmitting}>Submit</button>
            </form>
        </div>
    );
};

export default LoginForm;