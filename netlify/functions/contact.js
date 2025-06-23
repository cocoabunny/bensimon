const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  console.log("🚀 Contact function invoked");
  console.log("Method:", event.httpMethod);
  console.log("Headers:", JSON.stringify(event.headers, null, 2));

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    console.log("✅ Handling OPTIONS preflight request");
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    console.log("❌ Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    console.log("📧 Processing POST request...");

    // Parse form data
    let formData;
    try {
      formData = JSON.parse(event.body);
      console.log("✅ Parsed form data:", JSON.stringify(formData, null, 2));
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    // Validate required fields
    const { name, email, ideas } = formData;
    if (!name || !email || !ideas) {
      console.log("❌ Missing required fields:", {
        name: !!name,
        email: !!email,
        ideas: !!ideas,
      });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required fields: name, email, and ideas are required",
        }),
      };
    }

    // Environment variables check
    const zohoUser = process.env.ZOHO_USER;
    const zohoPass = process.env.ZOHO_PASS;
    const zohoReceiver = process.env.ZOHO_RECEIVER;

    console.log("🔐 Environment variables check:");
    console.log(
      "ZOHO_USER:",
      zohoUser
        ? `${zohoUser.substring(0, 3)}...@${zohoUser.split("@")[1]}`
        : "MISSING"
    );
    console.log(
      "ZOHO_PASS:",
      zohoPass
        ? `${zohoPass.length} characters - "${zohoPass.substring(
            0,
            2
          )}...${zohoPass.substring(zohoPass.length - 2)}"`
        : "MISSING"
    );
    console.log(
      "ZOHO_RECEIVER:",
      zohoReceiver
        ? `${zohoReceiver.substring(0, 3)}...@${zohoReceiver.split("@")[1]}`
        : "MISSING"
    );

    // Additional password validation
    if (zohoPass) {
      console.log("Password validation:");
      console.log("- Length:", zohoPass.length);
      console.log("- Contains spaces:", zohoPass.includes(" "));
      console.log(
        "- Contains quotes:",
        zohoPass.includes('"') || zohoPass.includes("'")
      );
      console.log("- First 3 chars:", zohoPass.substring(0, 3));
      console.log("- Last 3 chars:", zohoPass.substring(zohoPass.length - 3));
    }

    if (!zohoUser || !zohoPass || !zohoReceiver) {
      console.error("❌ Missing environment variables");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    // Create transporter with enhanced debugging
    console.log("📮 Creating Zoho SMTP transporter...");
    console.log("SMTP Config:", {
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: zohoUser,
        pass: `${zohoPass.substring(0, 3)}...${zohoPass.substring(
          zohoPass.length - 3
        )}`,
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: zohoUser,
        pass: zohoPass,
      },
      debug: true, // Enable debug logging
      logger: true, // Enable logging
      tls: {
        rejectUnauthorized: false, // This might help with certificate issues
      },
    });

    // Verify transporter
    console.log("🔍 Verifying SMTP connection...");
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", verifyError);
      console.error(
        "Full error details:",
        JSON.stringify(verifyError, null, 2)
      );

      // Try alternative configuration
      console.log(
        "🔄 Trying alternative SMTP configuration (port 465, SSL)..."
      );

      const altTransporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: zohoUser,
          pass: zohoPass,
        },
        debug: true,
        logger: true,
      });

      try {
        await altTransporter.verify();
        console.log("✅ Alternative SMTP connection verified successfully");
        // Use the alternative transporter for sending
        Object.assign(transporter, altTransporter);
      } catch (altVerifyError) {
        console.error(
          "❌ Alternative SMTP verification also failed:",
          altVerifyError
        );
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: "SMTP authentication failed",
            details:
              "Unable to connect to email server. Please try again later.",
          }),
        };
      }
    }

    // Prepare email content
    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Website: ${formData.website || "Not provided"}
How did you hear about us: ${formData.howDidYouHear || "Not specified"}

Message:
${ideas}

---
Sent from the portfolio contact form
    `.trim();

    const mailOptions = {
      from: `"Portfolio Contact Form" <${zohoUser}>`,
      to: zohoReceiver,
      replyTo: email,
      subject: `New Contact: ${name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    };

    console.log("📨 Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      replyTo: mailOptions.replyTo,
      subject: mailOptions.subject,
    });

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      }),
    };
  } catch (error) {
    console.error("❌ Function error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", JSON.stringify(error, null, 2));

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
