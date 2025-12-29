# Email Setup Instructions for Contact Form

The contact form is now fully functional and ready to use. Currently, it logs emails to the console for development purposes. To enable actual email sending in production, follow one of these options:

## Option 1: Resend (Recommended - Easiest)

1. Sign up at https://resend.com (has free tier)
2. Install the package:
   ```bash
   npm install resend
   ```
3. Get your API key from Resend dashboard
4. Add to your `.env` file:
   ```
   RESEND_API_KEY=your_api_key_here
   ```
5. Uncomment the Resend code in `/server/api/contact.post.ts` (lines 54-63)
6. Update the `from` email to use your verified domain

## Option 2: Nodemailer with Gmail

1. Install nodemailer:
   ```bash
   npm install nodemailer
   ```
2. Enable "App Passwords" in your Gmail account settings
3. Add to `.env`:
   ```
   EMAIL_USER=jehonaxhoxhajj@gmail.com
   EMAIL_PASS=your_app_password_here
   ```
4. Add this code to `/server/api/contact.post.ts`:
   ```typescript
   import nodemailer from 'nodemailer'
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
     }
   })
   
   await transporter.sendMail({
     from: process.env.EMAIL_USER,
     to: to,
     subject: `Mesazh i ri nga ${name}: ${subject}`,
     text: emailContent,
     replyTo: email
   })
   ```

## Option 3: SendGrid

1. Sign up at https://sendgrid.com
2. Install the package:
   ```bash
   npm install @sendgrid/mail
   ```
3. Get your API key
4. Add to `.env`:
   ```
   SENDGRID_API_KEY=your_api_key_here
   ```
5. Implement SendGrid in the API endpoint

## Current Setup

- **Email recipient**: jehonaxhoxhajj@gmail.com
- **Form fields**: Name, Email, Phone (optional), Subject, Message, Project Type (optional)
- **Validation**: Built-in with Zod schema
- **User feedback**: Toast notifications for success/error
- **API endpoint**: `/api/contact`

## Testing

The form currently works in development mode and logs the email content to the console. You can test it by:
1. Visiting http://localhost:3000/contact
2. Filling out the form
3. Checking the server console for the email output

## Production Deployment

Before deploying to production:
1. Choose and implement one of the email service options above
2. Add required environment variables to your hosting platform
3. Test the form thoroughly
4. Consider adding rate limiting to prevent spam

## Contact Page Features

✅ Responsive design matching the site theme
✅ Contact form with validation
✅ Contact information sidebar
✅ Social media links section
✅ Working hours display
✅ Quick info highlights
✅ Success/error toast notifications
✅ Loading states
✅ Accessible and mobile-friendly

## Support

If you need help setting up email functionality, refer to the documentation of your chosen email service provider.
