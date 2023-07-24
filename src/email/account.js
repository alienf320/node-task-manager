const sgMail = require('@sendgrid/mail')
const fs = require('fs')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  const htmlTemplate = fs.readFileSync('./src/email/template/welcome.html', 'utf-8');
  const msg = {
    to: email,
    from: 'aerocmc@gmail.com',
    subject: 'Welcome',
    html: htmlTemplate.replace('[Nombre del Usuario]', name)    
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = { sendWelcomeEmail }