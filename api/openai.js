require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');

const configuration =  new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

exports.generate_image = async (message) => {
  const response = await openai.createImage({
        prompt: message,
        n: 2,
        size: "512x512",
      });
    return response.data.data;
}

exports.chatcompletion = async (message) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 4000,
    temperature: 0.5
    })
    return response.data.choices[0].text
  }
