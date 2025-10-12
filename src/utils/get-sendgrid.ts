import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

// TODO: Ensure SENDGRID_API_KEY in .env.local is updated with new SendGrid account API key
// Get API key from: SendGrid Dashboard → Settings → API Keys → Create API Key
// Permissions needed: Mail Send (Full Access) + Marketing (Full Access for store)
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
sgClient.setApiKey(process.env.SENDGRID_API_KEY!);

export { sgMail, sgClient };