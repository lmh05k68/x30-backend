export const getValidationError = (error) => {
    return error.details.map(detail => {
        return {
            message: detail.message,
            field: detail.path.join(' ')
        }
    })
}