export const asyncHandler = (fn )=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

export class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
        this.status = (() => {
            switch (statusCode) {
                case 400:
                    return "Bad Request";
                case 401:
                    return "Unauthorized";
                case 403:
                    return "Forbidden";
                case 404:
                    return "Not Found";
                case 500:
                    return "Internal Server Error";
                default:
                    return "Unknown Error";
            }
        })();
        this.isOperational = true; // This is an operational error, not a programming error

        Error.captureStackTrace(this, this.constructor);
    }
}