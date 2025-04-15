# Gmail App Password Setup for Email Sending

This document explains how to set up a Gmail App password for sending emails from the ESSEN website's contact forms.

## What is an App Password?

An App password is a 16-character code that gives a less secure app or device permission to access your Google Account. App passwords can only be used with accounts that have 2-Step Verification turned on.

## Prerequisites

1. A Gmail account
2. 2-Step Verification enabled on your Gmail account

## Step 1: Enable 2-Step Verification (if not already enabled)

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select "Security" from the left navigation panel
3. Under "Signing in to Google," select "2-Step Verification"
4. Follow the steps to turn on 2-Step Verification

## Step 2: Create an App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select "Security" from the left navigation panel
3. Under "Signing in to Google," select "App passwords" 
   (Note: This option only appears if 2-Step Verification is enabled)
4. At the bottom, click "Select app" and choose "Mail"
5. Click "Select device" and choose "Other (Custom name)"
6. Enter "ESSEN Website" and click "Generate"
7. The app password will be displayed. This is a 16-character code with no spaces.
8. Copy this password (you won't be able to see it again)

## Step 3: Configure Environment Variables

Add the following variables to your `.env.local` file:

\`\`\`
GMAIL_EMAIL=your_gmail_address
GMAIL_APP_PASSWORD=your_16_character_app_password
\`\`\`

## Testing the Integration

After setting up the environment variables and deploying the application, test the contact form to ensure emails are being sent correctly. Check the server logs for any errors if emails are not being delivered.

## Troubleshooting

- **Authentication Failed**: Double-check your email address and app password
- **Email Not Sending**: Check if your Gmail account has any security restrictions
- **App Password Not Working**: Try generating a new app password
- **"Less Secure App Access" Message**: This is not relevant when using App passwords. App passwords work even with the highest security settings.

## Security Considerations

- Keep your app password secure and never commit it to version control
- Consider using a dedicated Gmail account for your application
- If you suspect your app password has been compromised, you can revoke it from your Google Account security settings
- App passwords give full access to your Gmail account, so use them carefully

## Advantages of Using App Passwords

- Simpler setup compared to OAuth2
- No need to create a Google Cloud project
- No refresh tokens to manage
- Works reliably for server-side applications

\`\`\`

The SimplifiedContactForm component doesn't need to be changed as it already works with the updated server action.
