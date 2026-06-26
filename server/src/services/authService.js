const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET;

// 📧 Mail Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔑 Helper: Generate random 8-character password
const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

// 📧 Helper: Send welcome email with credentials
const sendCredentials = async (email, username, password) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to Medicare Hospital – Your Account Credentials",
    text: `Dear Staff Member,

Welcome to Medicare Hospital.

We are pleased to have you as part of our team. Your account has been created successfully, and you can now access the Hospital Management System (HMS) using the credentials below:

Username: ${username}
Password: ${password}

For security purposes, we recommend changing your password after your first login.

Please keep these credentials confidential and do not share them with anyone.

If you experience any issues accessing your account, please contact the system administrator for assistance.

We wish you success in your role and look forward to your valuable contribution to Medicare Hospital.

Regards,
Medicare Hospital
Administration Team`,
  });
};

// ==========================================
// 1️⃣ ADMIN CREATE USER
// ==========================================
const createUserByAdmin = async (data) => {
  const {
    username,
    email,
    role,
    name,
    phone, // Note: Optional/undefined if coming from the updated staff form
    specialization,
    experience,
  } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if username already exists
    const existingUsername = await client.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );
    if (existingUsername.rows.length > 0) {
      throw new Error("Username already exists");
    }

    // Check if email already exists
    const existingEmail = await client.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );
    if (existingEmail.rows.length > 0) {
      throw new Error("Email already exists");
    }

    let doctor_id = null;
    let staff_id = null;

    // Create Doctor Profile
    if (role === "doctor") {
      const doctorRes = await client.query(
        `INSERT INTO doctors (name, phone, specialization, experience)
         VALUES ($1, $2, $3, $4)
         RETURNING doctor_id`,
        [name, phone || null, specialization, experience]
      );
      doctor_id = doctorRes.rows[0].doctor_id;
    }

    // Create Staff Profile
    if (role === "reception") {
      const staffRes = await client.query(
        `INSERT INTO staff (name, phone)
         VALUES ($1, $2)
         RETURNING staff_id`,
        [name, phone || null]
      );
      staff_id = staffRes.rows[0].staff_id;
    }

    // Generate and Hash Default Password
    const defaultPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create Application User Link
    const userRes = await client.query(
      `INSERT INTO users (username, email, password, role, doctor_id, staff_id, status, is_first_login)
       VALUES ($1, $2, $3, $4, $5, $6, 'VALID', TRUE)
       RETURNING user_id, username, email, role, doctor_id, staff_id`,
      [username, email, hashedPassword, role, doctor_id, staff_id]
    );

    // Send Mail Notifications
    await sendCredentials(email, username, defaultPassword);

    await client.query("COMMIT");

    return {
      message: "User created successfully",
      user: userRes.rows[0],
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// ==========================================
// 2️⃣ LOGIN
// ==========================================
const loginUser = async (data) => {
  const { username, password } = data;

  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  if (user.status !== "VALID") {
    throw new Error("Account disabled");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (user.is_first_login) {
    return {
      message: "Change password required",
      firstLogin: true,
      user_id: user.user_id,
    };
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
      doctor_id: user.doctor_id,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    },
  };
};

// ==========================================
// 3️⃣ FIRST LOGIN PASSWORD SET
// ==========================================
const setFirstPassword = async (user_id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users
     SET password = $1, is_first_login = FALSE, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2`,
    [hashed, user_id]
  );

  return { message: "Password set successfully" };
};

// ==========================================
// 4️⃣ CHANGE PASSWORD (WITH OLD VALIDATION)
// ==========================================
const changePassword = async (user_id, oldPassword, newPassword) => {
  const result = await pool.query("SELECT password FROM users WHERE user_id = $1", [user_id]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Old password incorrect");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users
     SET password = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2`,
    [hashed, user_id]
  );

  return { message: "Password changed successfully" };
};

// ==========================================
// 5️⃣ FORGOT PASSWORD (REQUEST OTP)
// ==========================================
const forgotPassword = async (identifier) => {
  const result = await pool.query(
    "SELECT user_id, email FROM users WHERE email = $1 OR username = $1",
    [identifier]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid username or email");
  }

  const user = result.rows[0];
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes Expiry

  await pool.query(
    `UPDATE users
     SET otp = $1, otp_expiry = $2
     WHERE user_id = $3`,
    [otp, otpExpiry, user.user_id]
  );

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Medicare Hospital Password Reset OTP",
    text: `Dear User,

Your OTP for password reset is:

${otp}

This OTP is valid for 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
Medicare Hospital
Administration Team`,
  });

  return { message: "OTP sent successfully" };
};

// ==========================================
// 6️⃣ RESET PASSWORD (VERIFY OTP)
// ==========================================
const resetPassword = async (identifier, otp, newPassword) => {
  const result = await pool.query(
    "SELECT user_id, otp, otp_expiry FROM users WHERE email = $1 OR username = $1",
    [identifier]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  if (!user.otp) {
    throw new Error("No OTP found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (new Date() > new Date(user.otp_expiry)) {
    throw new Error("OTP expired");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users
     SET password = $1, otp = NULL, otp_expiry = NULL, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2`,
    [hashed, user.user_id]
  );

  return { message: "Password reset successful" };
};

// ==========================================
// 7️⃣ DISABLE USER
// ==========================================
const disableUser = async (user_id) => {
  await pool.query(
    `UPDATE users
     SET status = 'INVALID', updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1`,
    [user_id]
  );

  return { message: "User disabled" };
};

// ==========================================
// 8️⃣ ENABLE USER
// ==========================================
const enableUser = async (user_id) => {
  await pool.query(
    `UPDATE users
     SET status = 'VALID', updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1`,
    [user_id]
  );

  return { message: "User enabled" };
};

module.exports = {
  createUserByAdmin,
  loginUser,
  setFirstPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  disableUser,
  enableUser,
};