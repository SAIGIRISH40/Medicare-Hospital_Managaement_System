import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";

export default function Revenue() {
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("");

  const [summary, setSummary] = useState({
    consultation_total: 0,
    medicine_total: 0,
    test_total: 0,
    revenue_total: 0,
  });

  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchRevenue();
  }, [filter]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);

      let url = "/revenue";

      if (filter) {
        url += `?filter=${filter}`;
      }

      const res = await API.get(url);

      setSummary(res.data.summary);
      setBills(res.data.bills);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) return <Loader />;

  const cards = [
    {
      title: "Consultation Revenue",
      value: summary.consultation_total,
      icon: "🩺",
    },
    {
      title: "Medicine Revenue",
      value: summary.medicine_total,
      icon: "💊",
    },
    {
      title: "Test Revenue",
      value: summary.test_total,
      icon: "🧪",
    },
    {
      title: "Total Revenue",
      value: summary.revenue_total,
      icon: "💰",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Revenue Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Revenue generated from completed visits
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          className="
            border
            rounded-lg
            px-4
            py-2
            bg-white
          "
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
        </select>

      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {cards.map((card) => (
          <div
            key={card.title}
            className="
              bg-gradient-to-r
              from-green-50
              to-white
              border-l-4
              border-primary
              rounded-xl
              p-5
              shadow-sm
            "
          >
            <div className="flex justify-between items-center">

              <h3 className="text-gray-600 font-medium">
                {card.title}
              </h3>

              <span className="text-2xl">
                {card.icon}
              </span>

            </div>

            <p className="text-3xl font-bold text-primary mt-3">
              ₹{formatCurrency(card.value)}
            </p>
          </div>
        ))}

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Revenue Records
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-center">

            <thead>
              <tr className="bg-green-50 text-gray-700">
                <th className="p-3">
                  Patient
                </th>

                <th className="p-3">
                  Consultation
                </th>

                <th className="p-3">
                  Medicine
                </th>

                <th className="p-3">
                  Tests
                </th>

                <th className="p-3">
                  Total
                </th>

                <th className="p-3">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {bills.length > 0 ? (
                bills.map((bill, index) => (
                  <tr
                    key={index}
                    className="
                      border-b
                      hover:bg-green-50
                      transition
                    "
                  >
                    <td className="p-3">
                      {bill.patient_name}
                    </td>

                    <td className="p-3">
                      ₹{formatCurrency(
                        bill.consultation_fee
                      )}
                    </td>

                    <td className="p-3">
                      ₹{formatCurrency(
                        bill.medicine_fee
                      )}
                    </td>

                    <td className="p-3">
                      ₹{formatCurrency(
                        bill.test_fee
                      )}
                    </td>

                    <td className="p-3 font-semibold text-green-700">
                      ₹{formatCurrency(
                        bill.total_bill
                      )}
                    </td>

                    <td className="p-3">
                      {formatDate(
                        bill.date
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="
                      p-6
                      text-gray-500
                    "
                  >
                    No revenue records found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}