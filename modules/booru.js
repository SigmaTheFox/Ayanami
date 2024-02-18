'use strict';

var Gelbooru = ['gb', 'gelbooru', 'gelb', 'gbooru'];
var Danbooru = ['db', 'danbooru', 'danb', 'dbooru'];
var Rule34 = ['r34', 'rule34'];

module.exports = class Booru {
    /**
     * Some sites might require an API key and/or a Username to use,
     * as an example, Gelbooru requires only an API key,
     * while Danbooru requires both an API key and a Username,
     * and Rule34 requires none.
     * @param {string} [APIKey] The API key for the site.
     * @param {string} [Username] The login username for the site.
     */

    constructor(APIKey = '', Username = '') {
        this.APIKey = APIKey;
        this.Username = Username;
    }

    /**
     * @example The available sites are ['Danbooru', 'Gelbooru']
     * @param {string} site The site to search on.
     * @param {string[]} tags The tags to search for.
     */

    async search(site, tags = ['']) {
        if (!site || typeof site !== 'string') throw new TypeError("No site defined."); // Check if the site got defined.

        var query = tags.join("+");
        var URL;

        switch (site.toLowerCase()) { // Set URL based on site property
            case 'gb':
            case 'gelbooru':
            case 'gelb':
            case 'gbooru':
                if (this.APIKey === '') throw new TypeError("API Key must be defined in Constructor."); // Check if API key got defined
                if (typeof this.APIKey !== 'string') throw new TypeError("API Key must be a String."); // Check if API key is a String

                URL = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=2&json=1${this.APIKey}&tags=sort:random+${query}`;
                break;
            case 'db':
            case 'danbooru':
            case 'danb':
                if (this.APIKey === '') throw new TypeError("API Key must be defined in Constructor."); // Check if API key got defined
                if (typeof this.APIKey !== 'string') throw new TypeError("API Key must be a String."); // Check if API key is a String
                if (this.Username === '') throw new TypeError("Username must be defined in Constructor."); // Check if Username got defined
                if (typeof this.Username !== 'string') throw new TypeError("Username must be a String."); // Check if Username is a String

                URL = `https://danbooru.donmai.us/posts/random.json?login=${this.Username}&api_key=${this.APIKey}&tags=${query}`;
                break;
            case 'r34':
            case 'rule34':
                URL = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=500&json=1&tags=${query}`;
                break;
            default:
                throw new Error("Must enter a valid site."); // Throw error if no valid site got defined
        }

        try {
            var imageURL;
            var booruURL;
            var rating;
            var character;
            var artist;

            var request = await fetch(URL); // Fetch data from URL
            var json = await request.json(); // Convert fetched data to JSON

            // Based on the site parameter, set the imageURL, rating, character and artist values
            if (Gelbooru.includes(site.toLowerCase())) {
                imageURL = json.post[0]['file_url'];
                booruURL = `https://gelbooru.com/index.php?page=post&s=view&id=${json.post[0].id}`
                rating = json.post[0].rating;
                character = undefined;
                artist = undefined;
            }
            else if (Danbooru.includes(site.toLowerCase())) {
                imageURL = json['file_url'];
                booruURL = `https://danbooru.donmai.us/posts/${json.id}`
                rating = json.rating;
                character = json['tag_string_character'];
                artist = json['tag_string_artist'];
            }
            else if (Rule34.includes(site.toLowerCase())) {
                var rng_img = json[Math.floor(Math.random() * json.length)];
                
                imageURL = `https://img.rule34.xxx//images/${rng_img.directory}/${rng_img.image}`;
                booruURL = `https://rule34.xxx/index.php?page=post&s=view&id=${rng_img.id}`
                rating = rng_img.rating;
                character = undefined;
                artist = undefined;
            }

            switch (rating) { // Make the rating value consistent
                case 's':
                case 'safe':
                    rating = 'Safe';
                    break;
                case 'q':
                case 'questionable':
                    rating = "Questionable";
                    break;
                case 'e':
                case 'explicit':
                    rating = 'Explicit';
                    break;
            }

            return { // Return an Object with the imageURL, rating, character and artist
                URL: imageURL,
                booruURL: booruURL,
                rating: rating,
                character: character,
                artist: artist
            }
        } catch (err) {
            throw new Error(err)
        }
    }
}
