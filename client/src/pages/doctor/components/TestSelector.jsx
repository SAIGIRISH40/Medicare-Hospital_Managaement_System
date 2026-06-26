import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { toast } from "react-toastify";

export default function TestSelector({
  selectedTests,
  setSelectedTests,
}) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 SEARCH TESTS
  const fetchTests = async (query) => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      const res = await API.get(
        `/tests?search=${encodeURIComponent(trimmed)}`
      );

      setSuggestions(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load tests ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTests(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 SELECT TEST
  const handleSelect = (test) => {
    const exists = selectedTests.find(
      (t) => t.test_id === test.test_id
    );

    if (exists) {
      toast.warning("Test already added");
      return;
    }

    setSelectedTests([
      ...selectedTests,
      test,
    ]);

    setSearch("");
    setSuggestions([]);
  };

  // 🔹 REMOVE TEST
  const removeTest = (id) => {
    setSelectedTests(
      selectedTests.filter(
        (t) => t.test_id !== id
      )
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h3 className="text-lg font-semibold mb-4">
        Tests
      </h3>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search test..."
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

            {suggestions.map((test) => (
              <div
                key={test.test_id}
                onClick={() => handleSelect(test)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              >
                <div className="flex justify-between">
                  <span>{test.name}</span>
                  <span>₹{test.price}</span>
                </div>
              </div>
            ))}

          </div>
        )}

      {/* NO RESULTS */}
      {search.length >= 2 &&
        !loading &&
        suggestions.length === 0 && (
          <div className="border rounded-lg p-3 mt-2 text-gray-500">
            No tests found
          </div>
        )}

      {/* SELECTED TESTS */}
      {selectedTests.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">

          {selectedTests.map((test) => (
            <div
              key={test.test_id}
              className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full flex items-center gap-2"
            >
              <span>
                {test.name} (₹{test.price})
              </span>

              <button
                onClick={() =>
                  removeTest(test.test_id)
                }
                className="text-red-500 font-bold"
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