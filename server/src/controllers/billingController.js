const billingService = require("../services/billingService");

// 1️⃣ Calculate Total Bill
const calculateBill = async (req, res) => {
  try {
    const { visit_id } = req.body;

    const result =
      await billingService.calculateTotalBill(
        visit_id
      );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// 2️⃣ Get Billing Details
const getBillingDetails = async (req, res) => {
  try {
    const { visit_id } = req.params;

    const visitResult =
      await billingService.calculateTotalBill(
        visit_id
      );

    const medicines =
      await billingService.getMedicinesByVisitId(
        visit_id
      );

    const tests =
      await billingService.getTestsByVisitId(
        visit_id
      );

    res.status(200).json({
      ...visitResult,
      medicines,
      tests,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// 3️⃣ Get Billing Visits
const getBillingVisits = async (req, res) => {
  try {
    const visits =
      await billingService.getBillingVisits();

    res.status(200).json(visits);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// 4️⃣ Mark Bill Paid
const markBillPaid = async (req, res) => {
  try {
    const { visit_id } = req.params;

    const result =
      await billingService.markBillPaid(
        visit_id
      );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  calculateBill,
  getBillingDetails,
  getBillingVisits,
  markBillPaid,
};