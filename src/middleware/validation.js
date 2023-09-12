
import Joi from "joi";
import { CustomError } from "../err";

// 데이터 유효성 검사 미들웨어
export default function validate(schema) {
    return async (req, res, next) => {
        try{
      const  validation = await schema.validateAsync(req.body);
      req.validatedData = validation;

      next();
    }catch(err){
        if(err.details[0]["type"]==='any.required'){
          next(new CustomError(400, '요청한 데이터 형식이 올바르지 않습니다.'))
        }
        next(new CustomError(412,err.details[0].message))
     }
    };
  }

//   err.details[0] {
//     message: '"title" is not allowed to be empty',
//     path: [ 'title' ],
//     type: 'string.empty',
//     context: { label: 'title', value: '', key: 'title' }
//   }
//   err.message "title" is not allowed to be empty
  