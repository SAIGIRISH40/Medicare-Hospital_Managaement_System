import { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

export default function Billing() {
  const [loading, setLoading] = useState(true);

  const [visits, setVisits] = useState([]);
  const [selectedVisitId, setSelectedVisitId] = useState(null); 
  const [bill, setBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredVisits, setFilteredVisits] = useState([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  // Filter logic
  useEffect(() => {
    let data = [...visits];

    if (search) {
      data = data.filter(
        (v) =>
          v.patient_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          v.doctor_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter(
        (v) =>
          v.payment_status?.toString().toLowerCase().trim() ===
          statusFilter.toLowerCase()
      );
    }

    setFilteredVisits(data);
  }, [visits, search, statusFilter]);

  const fetchVisits = async () => {
    try {
      const res = await API.get("/billing/visits");
      setVisits(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load visits");
    } finally {
      setLoading(false);
    }
  };

  const fetchBillDetails = async (visitId) => {
    try {
      const res = await API.get(`/billing/details/${visitId}`);
      setBill(res.data);
      setIsModalOpen(true); 
    } catch (err) {
      console.log(err);
      toast.error("Failed to load bill");
    }
  };

  const markAsPaid = async () => {
    try {
      await API.put(`/billing/pay/${selectedVisitId}`);
      toast.success("Payment completed");
      closeModal();
      fetchVisits();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Payment failed");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBill(null);
    setSelectedVisitId(null);
  };

  // Helper function to handle string variations seamlessly
  const shouldShowPayButton = () => {
    if (!bill) return false;

    const statusValue = bill.payment_status !== undefined ? bill.payment_status : bill.status;

    if (statusValue === undefined || statusValue === null) {
      return false;
    }

    const normalized = statusValue.toString().toUpperCase().trim();
    return normalized === "UNPAID" || normalized === "FALSE" || normalized === "0";
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Billing</h1>
        <p className="text-gray-500">View visit billing details</p>
      </div>

      {/* Top Filters */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Search Patient</label>
            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-green-50">
                <th className="p-3">S.No</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Bill</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredVisits.length > 0 ? (
                filteredVisits.map((visit, index) => {
                  const currentStatus = visit.payment_status || visit.status || "";
                  const isPaid = ["PAID", "TRUE", "1"].includes(currentStatus.toString().toUpperCase().trim());

                  return (
                    <tr key={visit.visit_id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{visit.patient_name}</td>
                      <td className="p-3">{visit.doctor_name}</td>
                      <td className="p-3 font-medium">₹{visit.total_bill}</td>
                      <td className="p-3">
                        <span
                          className={
                            isPaid
                              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                              : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                          }
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedVisitId(visit.visit_id);
                            fetchBillDetails(visit.visit_id);
                          }}
                          className="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-gray-500">
                    No visits found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop-up Bill Details Modal */}
      {isModalOpen && bill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50">
          <div className="absolute inset-0" onClick={closeModal}></div>

          <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto z-10">
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Bill Summary</h2>
                <p className="text-sm text-gray-500 mt-1">Detailed structural fees breakdown</p>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-2 text-2xl font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div>
              <span
                className={
                  !shouldShowPayButton()
                    ? "bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium"
                    : "bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium"
                }
              >
                {bill.payment_status ?? bill.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-gray-500 text-sm">Consultation Fee</p>
                <p className="text-xl font-bold text-primary mt-1">₹{bill.consultation_fee}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-gray-500 text-sm">Medicine Fee</p>
                <p className="text-xl font-bold text-primary mt-1">₹{bill.medicine_fee}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-gray-500 text-sm">Test Fee</p>
                <p className="text-xl font-bold text-primary mt-1">₹{bill.test_fee}</p>
              </div>
              <div className="bg-primary text-white p-4 rounded-xl shadow-sm">
                <p className="text-white text-opacity-80 text-sm">Total Bill</p>
                <p className="text-2xl font-bold mt-1">₹{bill.total_bill}</p>
              </div>
            </div>

            {/* Itemized Medicines Sub-Table */}
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 bg-opacity-50">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Medicines</h3>
              {bill.medicines?.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="bg-green-50 border-b text-gray-700">
                        <th className="p-3 text-sm font-semibold">Medicine</th>
                        <th className="p-3 text-sm font-semibold">Price</th>
                        <th className="p-3 text-sm font-semibold">Qty</th>
                        <th className="p-3 text-sm font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bill.medicines.map((med) => (
                        <tr key={med.medicine_id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="p-3 text-gray-600">{med.name}</td>
                          <td className="p-3 text-gray-600">₹{med.price}</td>
                          <td className="p-3 text-gray-600">{med.quantity}</td>
                          <td className="p-3 text-gray-700 font-medium">₹{med.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm pl-1">No medicines added to this visit.</p>
              )}
            </div>

            {/* Itemized Lab Tests Sub-Table */}
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 bg-opacity-50">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Tests</h3>
              {bill.tests?.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="bg-green-50 border-b text-gray-700">
                        <th className="p-3 text-sm font-semibold">Test</th>
                        <th className="p-3 text-sm font-semibold">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bill.tests.map((test) => (
                        <tr key={test.test_id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="p-3 text-gray-600">{test.name}</td>
                          <td className="p-3 text-gray-700 font-medium">₹{test.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm pl-1">No lab tests requested for this visit.</p>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-lg border font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              
              {shouldShowPayButton() && (
                <button
                  onClick={markAsPaid}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                >
                  Mark As Paid
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}