// pages/api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, website, ideas, howDidYouHear } = req.body;

  // Validate required fields
  if (!name || !email || !ideas) {
    return res
      .status(400)
      .json({ error: "Name, email, and ideas are required fields" });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Create transporter with Zoho SMTP settings
    const transporter = nodemailer.createTransporter({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS, // App password from Zoho
      },
    });

    // Verify connection
    await transporter.verify();

    // Email content matching your form fields
    const mailOptions = {
      from: process.env.ZOHO_USER,
      to: process.env.ZOHO_RECEIVER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Website:</strong> ${website || "Not provided"}</p>
        <p><strong>Ideas:</strong></p>
        <p>${ideas.replace(/\n/g, "<br>")}</p>
        <p><strong>How did you hear about me:</strong></p>
        <p>${
          howDidYouHear ? howDidYouHear.replace(/\n/g, "<br>") : "Not provided"
        }</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Website: ${website || "Not provided"}
        Ideas: ${ideas}
        How did you hear about me: ${howDidYouHear || "Not provided"}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending failed:", error);

    // Handle specific errors
    if (error.code === "EAUTH") {
      return res
        .status(500)
        .json({
          error: "Email authentication failed. Check your Zoho credentials.",
        });
    }

    if (error.code === "ECONNECTION") {
      return res
        .status(500)
        .json({ error: "Failed to connect to email server." });
    }

    res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
}
