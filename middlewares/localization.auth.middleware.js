import { loadLanguagePacks } from "../utils/localization.utils.js"

const languagePacks = loadLanguagePacks()

const localizationMiddleware = {
    applyLocalization: (req, res, next) => {
        const language = req.header('Accept-Language') ?? 'vi-vn'
        console.log(language,languagePacks)
        req.translate = (path, values) => {
            const currentLanguagePack = languagePacks[language]
            let message = currentLanguagePack[path] ?? path
            if(!!values){
                for (let key in values){
                    message = message.replace(`:${key}`, values[key])
                }
            }
            return message
        }
        next()
    }
}

export default localizationMiddleware