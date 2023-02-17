require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const PORT = 5000

app.use(bodyParser.json())
app.use(cors())

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION_KEY,
  apiKey: process.env.OPEN_AI_SECRET_KEY  
})

const openai = new OpenAIApi(configuration)

app.post("/", async (req, res) => {
  const { message, currentModel } = req.body

  console.log(message, "message")
  console.log(currentModel, "currentModel")

  const response = await openai.createCompletion({
    model: `${currentModel}`,
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5
  })

  res.json({ message: response.data.choices[0].text })
})

app.get("/models", async (req, res) => {
  const response = await openai.listEngines()

  console.log(response.data.data)

  res.json({ models: response.data.data })
})

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})