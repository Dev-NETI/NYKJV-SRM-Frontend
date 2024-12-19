export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-700 font-medium">Please wait...</p>
      </div>
    </div>
  );
}
