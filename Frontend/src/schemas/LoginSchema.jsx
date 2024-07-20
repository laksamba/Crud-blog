import * as yup from 'yup'

const LoginSchema = yup.object().shape({
    username: yup.string().min(5).max(30).required('username is required'),
    password : yup.string().min(4).max(25).required('password is required')
})

export default LoginSchema;