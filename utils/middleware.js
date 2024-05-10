const {info, error} = require("./logger")
function requestLogger(request, response, next) {
    info("Method:", request.method)
    info("Path:", request.path)
    info("Body:", request.body)
    info("---")
    next()
}

function unknownEndpoint(request, response, next) {
    return response.status(404).send({error:"unknown endpoint"})
}

function errorHandler(error, request, response, next) {
    if (error.name === "CastError") {
        return response.status(400).send({error:"malformatted id"})
    } else if (error.name === "ValidationError") {
        return response.status(400).json({error:error.message})
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}