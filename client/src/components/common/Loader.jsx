export default function LoaderWithText() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-3"></div>
      <p className="text-textSecondary text-sm">Loading...</p>
    </div>
  );
}