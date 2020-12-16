const webex = require('webex/env');
const yaml = require('js-yaml');
const { readFileSync } = require('fs');
const { join } = require('path');

const values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

module.exports = async (req, res) => {
  const { body } = req
  console.log(body)

  const message = await webex.messages.get(body.data.id);
  console.log(message)

  const text = message.text.trim().split(/\s+/)
  const command = text[1]
  const subcommand = text[2]

  if (command === "quiz" && subcommand.match(/^[0-9]+$/)) {
    const id = subcommand
    const doc = yaml.safeLoad(readFileSync(join(__dirname, 'config', 'quiz.yaml'), 'utf8'));
    const attachments = JSON.parse(readFileSync(join(__dirname, 'config', 'attachment.json'), 'utf8'));

    if (doc.quiz[id-1] === undefined) {
      const result = await webex.messages.create({
        text: `Oops! Quiz ${id} is undefined...`,
        roomId: body.data.roomId
      });
      console.log(result)
      res.send('')
    } else {
      attachments[0].content.body[0].text = doc.title
      attachments[0].content.body[1].text = doc.quiz[id-1].question
      attachments[0].content.body[2].choices = doc.quiz[id-1].choices.map((x, i) => { return { title: x, value: values[i] } })
      //attachments[0].content.body[2].id = `${id}`
      attachments[0].content.body[2].id = id
      if (doc.quiz[id-1].answers.includes(',')) {
        attachments[0].content.body[2].isMultiSelect = true
      }

      const result = await webex.messages.create({
        text: 'Quiz!',
        roomId: body.data.roomId,
        attachments: attachments
      });
      console.log(result)
      res.send('')
    }
  } else {
    const help = `
@mention me with one of the following commands

\`quiz {id}\` - Post quiz card
\`help\` - Print usage  
    `
    const result = await webex.messages.create({
      markdown: help,
      roomId: body.data.roomId
    });

    console.log(result)
    res.send('')
  }

}
