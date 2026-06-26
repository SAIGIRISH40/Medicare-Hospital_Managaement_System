import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";

export default function CreateVisit() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
  });

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        API.get("/patients"),
        API.get("/doctors"),
      ]);

      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load data ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FILTER PATIENTS
  // =========================
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return [];

    const search = patientSearch.toLowerCase();

    return patients
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(search) ||
          p.phone?.includes(search)
      )
      .slice(0, 8);
  }, [patientSearch, patients]);

  // =========================
  // FILTER DOCTORS
  // =========================
  const filteredDoctors = useMemo(() => {
    if (!doctorSearch.trim()) return [];

    const search = doctorSearch.toLowerCase();

    return doctors
      .filter(
        (d) =>
          d.name?.toLowerCase().includes(search) ||
          d.specialization?.toLowerCase().includes(search)
      )
      .slice(0, 8);
  }, [doctorSearch, doctors]);

  // =========================
  // SELECT PATIENT
  // =========================
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);

    setForm((prev) => ({
      ...prev,
      patient_id: patient.patient_id,
    }));

    setPatientSearch(
      `${patient.name} (${patient.phone})`
    );
  };

  // =========================
  // SELECT DOCTOR
  // =========================
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);

    setForm((prev) => ({
      ...prev,
      doctor_id: doctor.doctor_id,
    }));

    setDoctorSearch(
      `${doctor.name} (${doctor.specialization})`
    );
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.patient_id || !form.doctor_id) {
      toast.error("Please select patient and doctor ❌");
      return;
    }

    try {
      console.log("CREATE VISIT PAYLOAD:", form);

      await API.post("/visits", form);

      toast.success("Visit created successfully ✅");

      // Reset
      setForm({
        patient_id: "",
        doctor_id: "",
      });

      setSelectedPatient(null);
      setSelectedDoctor(null);

      setPatientSearch("");
      setDoctorSearch("");
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.error ||
          "Failed to create visit ❌"
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

        {/* HEADER */}
        <div className="bg-primary text-white p-6">
          <h1 className="text-3xl font-bold">
            Create Visit
          </h1>

          <p className="mt-1 text-sm opacity-90">
            Search and assign a patient to a doctor
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >

          {/* ========================= */}
          {/* PATIENT SEARCH */}
          {/* ========================= */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Patient
            </label>

            <input
              type="text"
              value={patientSearch}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setSelectedPatient(null);

                setForm((prev) => ({
                  ...prev,
                  patient_id: "",
                }));
              }}
              placeholder="Search by name or phone number..."
              className="
                w-full
                p-3
                border
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-primary
              "
            />

            {!selectedPatient &&
              patientSearch.trim() &&
              filteredPatients.length > 0 && (
                <div className="mt-2 border rounded-xl bg-white shadow max-h-64 overflow-y-auto">

                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.patient_id}
                      onClick={() =>
                        handlePatientSelect(patient)
                      }
                      className="
                        p-3
                        border-b
                        cursor-pointer
                        hover:bg-slate-50
                      "
                    >
                      <div className="font-medium">
                        {patient.name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {patient.phone}
                      </div>
                    </div>
                  ))}

                </div>
              )}
          </div>

          {/* PATIENT CARD */}
          {selectedPatient && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-700 mb-4">
                Selected Patient
              </h3>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedPatient.name}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedPatient.phone}
                </p>

                <p>
                  <strong>Gender:</strong>{" "}
                  {selectedPatient.gender}
                </p>

                <p>
                  <strong>Age:</strong>{" "}
                  {selectedPatient.age}
                </p>
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* DOCTOR SEARCH */}
          {/* ========================= */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Doctor
            </label>

            <input
              type="text"
              value={doctorSearch}
              onChange={(e) => {
                setDoctorSearch(e.target.value);
                setSelectedDoctor(null);

                setForm((prev) => ({
                  ...prev,
                  doctor_id: "",
                }));
              }}
              placeholder="Search doctor or specialization..."
              className="
                w-full
                p-3
                border
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-primary
              "
            />

            {!selectedDoctor &&
              doctorSearch.trim() &&
              filteredDoctors.length > 0 && (
                <div className="mt-2 border rounded-xl bg-white shadow max-h-64 overflow-y-auto">

                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.doctor_id}
                      onClick={() =>
                        handleDoctorSelect(doctor)
                      }
                      className="
                        p-3
                        border-b
                        cursor-pointer
                        hover:bg-slate-50
                      "
                    >
                      <div className="font-medium">
                        {doctor.name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {doctor.specialization}
                      </div>
                    </div>
                  ))}

                </div>
              )}
          </div>

          {/* DOCTOR CARD */}
          {selectedDoctor && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-semibold text-green-700 mb-4">
                Selected Doctor
              </h3>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedDoctor.name}
                </p>

                <p>
                  <strong>Specialization:</strong>{" "}
                  {selectedDoctor.specialization}
                </p>

                {selectedDoctor.phone && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedDoctor.phone}
                  </p>
                )}

                {selectedDoctor.email && (
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedDoctor.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="
              w-full
              bg-primary
              hover:opacity-90
              text-white
              py-3
              rounded-xl
              font-semibold
              text-lg
              transition-all
            "
          >
            Create Visit
          </button>

        </form>
      </div>
    </div>
  );
}