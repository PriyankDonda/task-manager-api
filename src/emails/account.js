const sgMail  = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Thank for joining in!',
        text: `Welcome to the App, ${name}. Let us know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Sorry to see you go!',
        text: `Thanks for working with us, ${name}. Please send your experience of working with us...`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}