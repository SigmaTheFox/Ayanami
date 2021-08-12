const fetch = require("node-fetch");
const FormData = require("form-data");

module.exports = class DeepL {
    constructor(token) {
        this.token = token
    }

    async translate(input, target_lang) {
        try {
            const form = new FormData();
            form.append("text", input);
            form.append("target_lang", target_lang);
            let res = await fetch("https://api-free.deepl.com/v2/translate", {
                method: "post",
                headers: { "Authorization": `DeepL-Auth-Key ${this.token}` },
                body: form
            })
            let json = await res.json();
            return {
                source_lang: json.translations[0].detected_source_language,
                text: json.translations[0].text
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}