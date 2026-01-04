export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, message } = body

  // Validation
  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide all required fields: name, email, message'
    })
  }

  console.log('--- New Contact Form Submission ---')
  console.log('From:', name)
  console.log('Email:', email)
  console.log('Message:', message)
  console.log('------------------------------------')

  /**
   * INTEGRATION TIP:
   * To send a real email, you can use services like:
   * 1. Resend (resend.com) - very easy for developers
   * 2. SendGrid
   * 3. Nodemailer (with your SMTP credentials)
   * 
   * Example with Resend:
   * 
   * import { Resend } from 'resend';
   * const resend = new Resend(process.env.RESEND_API_KEY);
   * 
   * await resend.emails.send({
   *   from: 'Contact Form <onboarding@resend.dev>',
   *   to: 'YOUR_EMAIL@HERE.COM',
   *   subject: `New Message from ${name}`,
   *   text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
   * });
   */

  return {
    success: true,
    message: 'Message received successfully'
  }
})
