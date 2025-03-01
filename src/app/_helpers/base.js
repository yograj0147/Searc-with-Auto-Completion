class BaseController {
    /*--------------------------returns response--------------------------*/
    //## success response
    successResponse = async (res, data = {}) => {
        const { statusCode = 200, result = {} } = data;
        const response = {
            statusCode,
            success: true,
            error: null,
            result
        }
        return res.status(response.statusCode).json(response);
    }

    //## error response
    errorResponse = async (res, statusCode = 500, error = null) => {
        const response = {
            statusCode,
            success: false,
            error: error,
            result: {},
        };
        return res.status(response.statusCode).json(response);
    };
    /*-------------------------------------------------------------------------------*/
}

module.exports = BaseController;