const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIXED PATHS
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const visitRoutes = require("./routes/visitRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const testRoutes = require("./routes/testRoutes");
const visitMedicineRoutes = require("./routes/visitMedicineRoutes");
const visitTestRoutes = require("./routes/visitTestRoutes");
const billingRoutes = require("./routes/billingRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const doctorDashboardRoutes = require( "./routes/doctorDashboardRoutes");
const revenueRoutes = require("./routes/revenueRoutes");
const staffRoutes = require("./routes/staffRoutes");

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/visit-medicines", visitMedicineRoutes);
app.use("/api/visit-tests", visitTestRoutes);
app.use("/api/billing", billingRoutes);
app.use( "/api/consultation", consultationRoutes);
app.use( "/api/doctor-dashboard", doctorDashboardRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/staff", staffRoutes);
// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("🏥 Hospital Management System API is running...");
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
  });
});

module.exports=app;

