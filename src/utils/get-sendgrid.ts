import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
sgClient.setApiKey(process.env.SENDGRID_API_KEY!);

export { sgMail, sgClient };