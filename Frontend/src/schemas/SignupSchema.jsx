import * as yup from 'yup'

const errormessage = 'only alphanumberic '
const SignupSchema = yup.object().shape({
    name: yup.string().min(5).max(30).required('name is required'),
    username: yup.string().min(5).max(30).required('username is required'),
    email: yup.string().email({ minDomainSegments: 2 }).required('email  is required'),
    password : yup.string().min(5).max(30).matches(/^[a-zA-Z0-9]{3,30}$/,{message:errormessage}).required('password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')],'password must match').required(),
})

export default SignupSchema;