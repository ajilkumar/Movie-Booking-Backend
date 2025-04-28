const getVerificationEmailTemplate = (verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
      <style>
        .container {
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header img {
          width: 100px;
          margin-bottom: 20px;
        }
        .content {
          text-align: center;
        }
        .button {
          display: inline-block;
          padding: 15px 25px;
          margin-top: 20px;
          font-size: 16px;
          color: #ffffff !important;
          background-color: #007BFF;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #888888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Book My Show</h2>
        </div>
        <div class="content">
          <h3>Please Verify Your Email</h3>
          <p>Thank you for registering with us! You're receiving this email because you have an account in Silver Screen. Please click the button below to verify your email address.</p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <p>If you are not sure why you're receiving this, please contact us by replying to this email.</p>
        </div>
        <div class="footer">
          <p>If you did not create an account, no further action is required.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export { getVerificationEmailTemplate };
