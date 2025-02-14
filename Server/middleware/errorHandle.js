import Joi from 'joi'

const errorHandler = (error, req, res, next) =>{
    // defalul error 
    let status = 500;
    let data = { 
        message: 'internal server error'
    }
    if(error instanceof Joi.ValidationError ){
        status = 401;
        data.message= error.message;

        return res.status(status).json(data);
    }
    if (error.status){
        status = error.status;
    }
    if(error.message){
        data.message = error.message;
    }
    return res.status(status).json(data);
}

export default errorHandler;