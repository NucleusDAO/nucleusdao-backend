const { sendEmail } = require('../utils');

exports.contactUs = async (req, res) => {
  const { email, subject, body, imageUrl } = req.body;

  if (!email || !subject || !body) {
    return res.status(400).json({ error: 'Subject and body are required.' });
  }

  const htmlContent = `
        <p style="font-weight: 600; font-size: 22px; color: #292929">
        Thank You for Contacting Us!
        </p>
        <p>Hi,</p>
        <p>
        Thank you for reaching out to us. We have received your message and will get back to you soon.
        </p>
        <h3 style="color: #292929;">Your Message:</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Body:</strong> ${body}</p>
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="User Provided Image" style="max-width: 100%; height: auto;" />`
            : ''
        }
        <p>
        Thank you for being a part of our community. We appreciate your input and will respond as soon as possible.
        </p>
    `;
  try {
    await sendEmail(
      [{ email_address: { address: email, name: email } }],
      'NucleusDAO - Contact Us',
      htmlContent,
      [
        {
          email_address: {
            address: 'support@nucleusdao.com',
            name: 'NucleausDAO Team',
          },
        },
      ]
    );

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
  }
};
