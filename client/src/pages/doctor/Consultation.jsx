import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";

import TestSelector from "./components/TestSelector";
import MedicineSelector from "./components/MedicineSelector";

export default function Consultation() {
  const { visitId } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  const [diagnosis, setDiagnosis] = useState("");

  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [history, setHistory] = useState([]);

  // =========================
  // FETCH VISIT
  // =========================
  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await API.get(`/visits/${visitId}`);

        setVisit(res.data);
        setDiagnosis(res.data.diagnosis || "");

        const historyRes = await API.get(`/visits/${visitId}/history`);
        setHistory(historyRes.data);
      } catch (err) {
        console.log(err)
        toast.error("Failed to load visit");
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [visitId]);

  // =========================
  // SAVE CONSULTATION
  // =========================
  const saveConsultation = async () => {
    try {
      const payload = {
        visit_id: Number(visitId),
        diagnosis,
        tests: selectedTests,
        medicines: selectedMedicines,
      };

      await API.post("/consultation/save", payload);
      toast.success("Consultation saved successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to save consultation"
      );
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";

    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // COMPLETE VISIT
  // =========================
  const completeVisit = async () => {
    try {
      await API.post("/consultation/complete", {
        visit_id: Number(visitId),
        medicines: selectedMedicines,
      });

      const updatedVisit = await API.get(`/visits/${visitId}`);

      setVisit(updatedVisit.data);
      toast.success("Visit completed successfully");

      setTimeout(() => {
        navigate("/doctor/patients");
      }, 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to complete visit"
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* PATIENT INFO */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {visit?.patient_name}
        </h2>

        <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm text-gray-600">
          <p>
            <strong>Phone:</strong> {visit?.phone}
          </p>
          <p>
            <strong>Age:</strong> {visit?.age}
          </p>
          <p>
            <strong>Gender:</strong> {visit?.gender}
          </p>
          <p>
            <strong>Doctor:</strong> {visit?.doctor_name}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="font-medium text-primary">
              {visit?.status || "Pending"}
            </span>
          </p>
        </div>
      </div>

      {/* PREVIOUS HISTORY */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Previous Visit History
        </h3>

        {history.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.visit_id}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-primary">
                    Visit #{item.visit_id}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(item.date)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p>
                    <strong>Status:</strong> {item.status}
                  </p>
                  <p>
                    <strong>Diagnosis:</strong> {item.diagnosis || "N/A"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* MEDICINES */}
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">
                      Medicines
                    </h4>
                    {item.medicines?.length > 0 ? (
                      <ul className="space-y-1">
                        {item.medicines.map((med, index) => (
                          <li key={index}>
                            • {med.name} × {med.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No medicines</p>
                    )}
                  </div>

                  {/* TESTS */}
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">
                      Tests
                    </h4>
                    {item.tests?.length > 0 ? (
                      <ul className="space-y-1">
                        {item.tests.map((test, index) => (
                          <li key={index}>• {test.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No tests</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No previous records found</p>
        )}
      </div>

      {/* DIAGNOSIS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Diagnosis</h3>
        <textarea
          rows={5}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter diagnosis..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* TESTS */}
      <TestSelector
        selectedTests={selectedTests}
        setSelectedTests={setSelectedTests}
      />

      {/* MEDICINES */}
      <MedicineSelector
        selectedMedicines={selectedMedicines}
        setSelectedMedicines={setSelectedMedicines}
      />

      {/* ACTION BUTTONS */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={saveConsultation}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Save Consultation
          </button>

          <button
            onClick={completeVisit}
            disabled={visit?.status === "Completed"}
            className={`flex-1 py-3 rounded-lg font-medium text-white transition-colors
              ${visit?.status === "Completed" 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {visit?.status === "Completed"
              ? "Visit Completed"
              : "Complete Visit"}
          </button>
        </div>
      </div>
    </div>
  );
}