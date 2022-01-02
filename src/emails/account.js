const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'agr.vik87@gmail.com',
        subject: 'Welcome to Task Manager App',
        text: `Hi ${name}! Let me know you get along with app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'agr.vik87@gmail.com',
        subject: 'Sorry to see you go',
        text: `Hi ${name}! Please let us know the reasons you don't want to continue.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}