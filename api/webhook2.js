const webex = require('webex/env');
const yaml = require('js-yaml');
const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = async (req, res) => {
  const { body } = req
  console.log(body)

  const attachment = await webex.attachmentActions.get(body.data.id);
  console.log(attachment)

  try {
    const doc = yaml.safeLoad(readFileSync(join(__dirname, 'config', 'quiz.yaml'), 'utf8'));
    const id = Object.keys(attachment.inputs)[0]
    var result
    if (attachment.inputs[id] === doc.quiz[parseInt(id,10)-1].answers) {
      result = await webex.messages.create({
        parentId: attachment.messageId,
        roomId: body.data.roomId,
        markdown: `<@personId:${body.data.personId}> Correct!`
      });
    } else {
      result = await webex.messages.create({
        parentId: attachment.messageId,
        roomId: body.data.roomId,
        markdown: `<@personId:${body.data.personId}> Incorrect!`,
      });
    }
    console.log(result)
    res.send('')
  } catch (e) {
    console.log(e);
  }
}
