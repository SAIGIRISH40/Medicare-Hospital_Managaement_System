const consultationService = require(
  "../services/consultationService"
);

const consultationCompleteService = require(
  "../services/consultationCompleteService"
);

// =========================
// SAVE CONSULTATION
// =========================
const saveConsultation = async (req, res) => {
  try {

    console.log(
      "CONSULTATION REQUEST:",
      JSON.stringify(req.body, null, 2)
    );

    const result =
      await consultationService.saveConsultation(
        req.body
      );

    res.status(200).json({
      message: "Consultation saved successfully",
      data: result,
    });

  } catch (error) {

    console.log(
      "CONSULTATION ERROR:",
      error
    );

    res.status(400).json({
      error: error.message,
    });
  }
};

const completeConsultation = async (
  req,
  res
) => {
  try {
    const result =
      await consultationCompleteService.completeConsultation(
        req.body
      );

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  saveConsultation,
  completeConsultation
};