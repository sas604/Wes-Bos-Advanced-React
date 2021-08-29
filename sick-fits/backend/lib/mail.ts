import { createTransport } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string) {
  return `
    <div style="
        border:1px solid black; 
        padding: 20px;
        font-family: sans-serif;
        line-height:2;
        font-size: 20px;
       ">
         <h2>Hello There!</h2>
         <p>${text}</p>
         <p>😘, Alex</p>
       </div>
    `;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // Email user token
  const info = await transport.sendMail({
    to,
    from: 'alex@tagunov.dev',
    subject: 'Your password reset token',
    html: makeANiceEmail(`Your password reset token is here!
    
    <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset </a>
    
    `),
  });
  console.log(info);
}
