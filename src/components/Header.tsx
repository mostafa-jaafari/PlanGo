



export default function Header() {
  return (
    <header className="w-full flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center gap-2">
        <span className="bg-yellow-600 border border-dashed rounded p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m0 0l3-3m-3 3l-3-3m6-4a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <h1 className="text-xl font-bold">PlanGo</h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}