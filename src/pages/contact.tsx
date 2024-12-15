import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Image from 'next/image';
import Layout from 'components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/Button';
import { useRouter } from 'next/router';

const ContactPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if reCAPTCHA is completed
    if (!recaptchaValue) {
      alert('Please complete the reCAPTCHA');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          recaptchaValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Message sent successfully!');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
        });
        setRecaptchaValue(null);
        await router.push('/thank-you');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      alert('Failed to send message. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout 
      pageTitle={'Contact | Cru Scanlan Photography'}
      pageDescription={'Get in touch with Cru Scanlan Photography. Contact me for image licensing, print purchases, or any questions about my photography work.'}
      pageClass="bg-darkSecondary text-lightPrimary w-full flex justify-center" 
      padTop={true}
    >
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold tracking-wide text-center my-8">
            CONTACT
        </h1>
        <div className="text-lightPrimary my-8">
            <div className="max-w-4xl mx-auto p-4">
                <p className="mb-4">
                    Have a question about my work or interested in licensing an image? I'd love to hear from you. Fill out the form below and I'll get back to you as soon as possible.
                </p>
                <p>
                    All my images are available for purchase as prints or licensing. For licensing inquiries, please include details about the specific image(s), intended use, duration, and budget in your message.
                </p>
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 px-8 mt-8">
          {/* Left column with image and social links */}
          <div className="md:w-1/3">
            <div className="mb-4">
                
                <h2 className="text-xl text-gray-400 mt-1">
                    Cru Scanlan
                </h2>
            </div>
            <div className="relative aspect-[5/4] w-full mb-4">
              <Image
                src="/pages/contact/cru-aurora.jpg"
                alt="Person standing near illuminated tent under purple aurora sky"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={['fab', 'instagram']} />
                <a 
                  href="https://instagram.com/cruscanlan" 
                  className="text-lightPrimary hover:text-lightSecondary no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @cruscanlan
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={['fab', 'facebook']} />
                <a 
                  href="https://facebook.com/cruscanlan" 
                  className="text-lightPrimary hover:text-lightSecondary no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cruscanlan
                </a>
              </div>
            </div>
          </div>

          {/* Right column with form */}
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition transform hover:translate-y-[-1px] hover:shadow-lg"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition transform hover:translate-y-[-1px] hover:shadow-lg"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition transform hover:translate-y-[-1px] hover:shadow-lg"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition transform hover:translate-y-[-1px] hover:shadow-lg"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message <span className="text-orange-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition transform hover:translate-y-[-1px] hover:shadow-lg"
                />
              </div>

              {/* Bottom section with reCAPTCHA and button */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full">
                  <ReCAPTCHA
                    className="flex justify-center"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={(value) => setRecaptchaValue(value)}
                    theme="dark"
                  />
                </div>
                
                <div className="w-full">
                    <Button
                        type="filled"
                        disabled={isSubmitting}
                        size="lg"
                        clickable
                        classes={`px-8 py-3 text-white font-medium transition-all duration-200`}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;