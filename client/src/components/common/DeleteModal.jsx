export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete",
  message = "Are you sure you want to delete this item?",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-bgLight w-[360px] rounded-2xl shadow-xl overflow-hidden">

        {/* 🔴 Header */}
        <div className="bg-danger px-6 py-3">
          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>
        </div>

        {/* 📝 Body */}
        <div className="p-6 text-center">
          <p className="text-textPrimary">
            {message}
          </p>
        </div>

        {/* 🔘 Footer */}
        <div className="flex gap-3 px-6 pb-6">

          {/* 🔴 Delete */}
          <button
            onClick={onConfirm}
            className="flex-1 bg-danger text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Delete
          </button>

          {/* 🟢 Cancel */}
          <button
            onClick={onClose}
            className="flex-1 bg-success text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}