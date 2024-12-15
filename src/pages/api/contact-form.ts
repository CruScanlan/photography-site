import type { NextApiRequest, NextApiResponse } from 'next';
import { sgMail } from 'utils/get-sendgrid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, recaptchaValue } = req.body;

    // Verify reCAPTCHA
    const recaptchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaValue}`,
    });

    const recaptchaData = await recaptchaVerification.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ message: 'Invalid reCAPTCHA' });
    }

    const msg = {
      to: 'cruscanlan@gmail.com', // The email where you want to receive messages
      from: 'Cru Scanlan Photography<noreply@cruscanlan.com>', // Your verified sender email
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await sgMail.send(msg);
    res.status(200).json({ 
      success: true, 
      redirectUrl: '/thank-you'
    });
    console.log('Email sent successfully from contact form');
  } catch (error: any) {
    console.error('Error sending email:', error.response?.body || error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message' 
    });
  }
}
