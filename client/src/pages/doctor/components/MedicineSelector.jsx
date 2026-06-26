import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { toast } from "react-toastify";

export default function MedicineSelector({
  selectedMedicines,
  setSelectedMedicines,
}) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tempMedicine, setTempMedicine] = useState({
    medicine_id: null,
    name: "",
    quantity: "",
  });

  // 🔹 SEARCH MEDICINES
  const fetchMedicines = async (query) => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      const res = await API.get(
        `/medicines?search=${encodeURIComponent(trimmed)}`
      );

      setSuggestions(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load medicines ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedicines(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 SELECT MEDICINE
  const handleSelect = (medicine) => {
    const exists = selectedMedicines.find(
      (m) => m.medicine_id === medicine.medicine_id
    );

    if (exists) {
      toast.warning("Medicine already added");
      return;
    }

    setTempMedicine({
      medicine_id: medicine.medicine_id,
      name: medicine.name,
      quantity: "",
    });

    setSearch("");
    setSuggestions([]);
  };

  // 🔹 ADD MEDICINE
  const addMedicine = () => {
    if (
      !tempMedicine.medicine_id ||
      !tempMedicine.quantity ||
      Number(tempMedicine.quantity) <= 0
    ) {
      toast.warning("Enter a valid quantity");
      return;
    }

    setSelectedMedicines([
      ...selectedMedicines,
      {
        ...tempMedicine,
        quantity: Number(tempMedicine.quantity),
      },
    ]);

    setTempMedicine({
      medicine_id: null,
      name: "",
      quantity: "",
    });
  };

  // 🔹 REMOVE MEDICINE
  const removeMedicine = (id) => {
    setSelectedMedicines(
      selectedMedicines.filter(
        (m) => m.medicine_id !== id
      )
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h3 className="text-lg font-semibold mb-4">
        Medicines
      </h3>

      {/* SEARCH BOX */}
      <input
        type="text"
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500 mt-2">
          Loading...
        </p>
      )}

      {/* SUGGESTIONS */}
      {search.length >= 2 &&
        suggestions.length > 0 && (
          <div className="border rounded-lg mt-2 max-h-48 overflow-y-auto">

            {suggestions.map((medicine) => (
              <div
                key={medicine.medicine_id}
                onClick={() =>
                  handleSelect(medicine)
                }
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              >
                {medicine.name}
              </div>
            ))}

          </div>
        )}

      {/* NO RESULTS */}
      {search.length >= 2 &&
        !loading &&
        suggestions.length === 0 && (
          <div className="border rounded-lg p-3 mt-2 text-gray-500">
            No medicines found
          </div>
        )}

      {/* SELECTED MEDICINE DETAILS */}
      {tempMedicine.medicine_id && (
        <div className="border rounded-lg p-4 mt-4 space-y-3">

          <h4 className="font-medium">
            {tempMedicine.name}
          </h4>

          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={tempMedicine.quantity}
            onChange={(e) =>
              setTempMedicine({
                ...tempMedicine,
                quantity: e.target.value,
              })
            }
            className="w-full border p-2 rounded"
          />

          <button
            onClick={addMedicine}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Medicine
          </button>

        </div>
      )}

      {/* SELECTED MEDICINES */}
      {selectedMedicines.length > 0 && (
        <div className="mt-5 space-y-2">

          {selectedMedicines.map((medicine) => (
            <div
              key={medicine.medicine_id}
              className="flex justify-between items-center bg-green-100 text-green-700 px-4 py-2 rounded"
            >
              <div>
                <p className="font-medium">
                  {medicine.name}
                </p>

                <p className="text-sm">
                  Quantity: {medicine.quantity}
                </p>
              </div>

              <button
                onClick={() =>
                  removeMedicine(
                    medicine.medicine_id
                  )
                }
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}