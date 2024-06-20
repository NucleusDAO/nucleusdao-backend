var { SendMailClient } = require('zeptomail');

const DAOBASEURL = 'https://app.nucleusdao.com/daos';

const url = 'api.zeptomail.com/';
const token =
  'Zoho-enczapikey wSsVR612/RPyWKt9nzKsdug7n1pRB1+gHEUr2VT143KuGfjGocc6nkLOAQCkSPAcEG5sQjITprN8kEtW1TMMjNh4ylADDSiF9mqRe1U4J3x17qnvhDzDXG5bmxeKLooOxAxvmWdkG8Em+g==';

let client = new SendMailClient({ url, token });

exports.sendEmail = async (recipient, subject, body) => {
  const htmlBody = buildHtmlBody(body);
  try {
    client
      .sendBatchMail({
        from: {
          address: 'noreply@nucleusdao.com',
          name: 'NucleusDAO',
        },
        to: recipient,
        reply_to: [
          {
            address: 'support@nucleusdao.com',
            name: 'NucleusDAO Team',
          },
        ],
        subject: subject,
        htmlbody: htmlBody,

        track_clicks: true,
        track_opens: true,
        client_reference: '',
      })
      .then((resp) => console.log('Email successfully sent'))
      .catch((error) => console.log('error'));
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

const sendBatchEmail = async (recipients, subject, body) => {
  const htmlBody = buildHTMLTemplate(body);
  try {
    client
      .sendBatchMail({
        from: {
          address: 'noreply@nucleusdao.com',
          name: 'NucleusDAO',
        },
        to: recipients,
        reply_to: [
          {
            address: 'support@nucleusdao.com',
            name: 'NucleusDAO Team',
          },
        ],
        subject: subject,
        htmlbody: htmlBody,

        track_clicks: true,
        track_opens: true,
        client_reference: '',
      })
      .then((resp) => console.log('Batch email successfully sent'))
      .catch((error) => console.log('error'));
  } catch (error) {
    console.error('Failed to send batch email:', error);
    throw error;
  }
};

exports.sendWaitlistEmail = async (recipient) => {
  client
    .mailBatchWithTemplate({
      template_key:
        '2d6f.73248db616942dc2.k1.57058a40-2d4c-11ef-8c69-525400fa05f6.1902a7398e4',
      template_alias: '',
      from: {
        address: 'noreply@nucleusdao.com',
        name: 'Nucleus DAO',
      },
      to: [
        {
          email_address: {
            address: recipient,
            name: recipient,
          },
        },
      ],
      reply_to: [
        {
          address: 'support@nucleusdao.com',
          name: 'Nucleus DAO Team',
        },
      ],
      client_reference: '',
      mime_headers: {
        'X-Test': 'test',
      },
    })
    .then((resp) => console.log('Waitlist email successfully sent'))
    .catch((error) => console.log('error'));
};

exports.sendDAOCreatedEmails = async (dao, emailRecipients) => {
  const htmlBody = `<p style="font-weight: 600; font-size: 22px; color: #292929">
            A New DAO Has Been Created!
          </p>
          <p>Hi {{name}},</p>
          <p>
            We're excited to inform you that a new DAO named ${dao.name} has just
            been created on NucleusDAO!
          </p>
          <p>${dao.description}</p>
          <div
            style="
              width: 100%;
              padding: 10px 0;
              border-radius: 100%;
            "
          >
            <img
              src="${dao.image}"
              alt="${dao.name}"
              style="
                display: block;
                margin: auto;
                height: 180px;
                width: 180px;
                padding: 10px 0;
                text-align: center;
                object-fit: cover;
                border-radius: 100%;
              "
            />
          </div>
          <a
            href="${DAOBASEURL}/${dao.id}"
            style="
              text-align: center;
              display: block;
              width: fit-content;
              background-color: #471094;
              padding: 15px 60px;
              border-radius: 8px;
              border: none;
              color: white;
              margin: 0 auto;
              text-decoration: none;
            "
            role="button"
          >
            View DAO
          </a>

          <p>
            Thank you for being a part of our community. We're excited to see
            the innovative ways you'll engage with ${dao.name} and contribute to
            its success.
          </p>`;

  const recipients = emailRecipients.map((user) => {
    return {
      email_address: {
        address: user.email,
        name: user.username,
      },
      merge_info: {
        name: user.username || 'There',
      },
    };
  });
  sendBatchEmail(recipients, 'NucleusDAO - New DAO Created', htmlBody);
};

exports.sendProposalsCreatedEmails = async (dao, emailRecipients) => {
  const htmlBody = `<p style="font-weight: 600; font-size: 22px; color: #292929">
            A New Proposal Has Been Created in ${dao.name}!
          </p>
          <p>Hi {{name}},</p>
          <p>
            We're excited to inform you that a new proposal has been created in
            the ${dao.name}!
          </p>
          <div
            style="
              width: 100%;
              padding: 20px 0;
            "
          >
            <a
              href="${DAOBASEURL}/daos/${dao.id}"
              style="
                text-align: center;
                display: block;
                width: fit-content;
                background-color: #471094;
                padding: 15px 60px;
                border-radius: 8px;
                border: none;
                color: white;
                margin: auto;
                text-decoration: none;
              "
              role="button"
            >
              Vote Now
            </a>
          </div>
          <p>
            Your participation is crucial to the success of the ${dao.name}.
            Please take a moment to review the proposal and cast your vote.
          </p>`;

  const recipients = emailRecipients.map((user) => {
    return {
      email_address: {
        address: user.email,
        name: user.username,
      },
      merge_info: {
        name: user.username || 'There',
      },
    };
  });
  sendBatchEmail(
    recipients,
    `NucleusDAO - New Proposal in ${dao.name}`,
    htmlBody
  );
};

const buildHTMLTemplate = (htmlBody) => {
  return ` <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to the NucleusDAO Waitlist!</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      margin: 0 auto !important;
      padding: 0;
      width: 580px;
      max-width: 580px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="600"
      style="background-color: #fff"
    >
      <tr
        style="
          background-color: #471094;
          height: 70px;
          padding: 30px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          background-image: url('https://res.cloudinary.com/djn4tphfy/image/upload/v1716297814/idxfjxwjotj2gwsvdmvh.png');
        "
      >
        <td style="padding: 10px 20px">
          <a href="https://nucleusdao.com/" target="_blank">
            <img
              src="https://res.cloudinary.com/djn4tphfy/image/upload/v1716298133/eaf6ms62kupjll7kltti.png"
              alt="Logo"
              style="max-width: 100%; height: auto; width: 150px"
            />
          </a>
        </td>
      </tr>
      <tr style="background-color: #f9f5ff; padding: 20px">
        <td style="padding: 20px; color: #444444; font-weight: 300">
        ${htmlBody}
        </td>
      </tr>
      <tr
        style="
          background-color: #471094;
          height: 70px;
          padding: 30px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          background-image: url('https://res.cloudinary.com/djn4tphfy/image/upload/v1716297814/idxfjxwjotj2gwsvdmvh.png');
        "
      >
        <td
          style="
            padding: 10px 20px;
            margin: 0 auto;
            width: 100%;
            text-align: center;
          "
        >
          <a href="https://nucleusdao.com/" target="_blank">
            <img
              src="https://res.cloudinary.com/djn4tphfy/image/upload/v1716298133/eaf6ms62kupjll7kltti.png"
              alt="Logo"
              style="
                max-width: 100%;
                height: auto;
                width: 150px;
                padding: 15px 0;
              "
            />
          </a>
          <p
            style="
              color: white;
              font-weight: 300;
              padding: 0px 0;
              font-size: 12px;
            "
          >
            2024 NucleusDAO. All Rights Reserved
          </p>
          <a href="https://twitter.com/nucleusdao">
            <img
              src="https://res.cloudinary.com/djn4tphfy/image/upload/v1716299217/lzes0mmdtmdyceacfga7.png"
              alt="X/Twitter Link"
              style="width: 30px; height: 30px"
          /></a>
          <p style="font-size: 14px; color: white">
            You are receiving this email because you subscribe to our mailing
            list. <a href="https://app.nucleusdao.com/settings/notifications" style="color: white">Unsubscribe.</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
