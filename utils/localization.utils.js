import messagesVI from "../resources/messages.vi-vn.js"
import messagesEN from "../resources/messages.en-us.js"

export const loadLanguagePacks = () => {
    return {
        'vi-vn': messagesVI,
        'en-us': messagesEN
    }
}