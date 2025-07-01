
const Sidebar = ({ role, onLogout }) => {
    return (
        <aside className="w-64 bg-white shadow-md border-r border-gray-200">
            <div className="h-16 flex items-center justify-center text-2xl font-bold text-amber-500">
                Dashboard
            </div>
            <nav className="px-4 py-6 space-y-4">
                <a href="#" className="block px-4 py-2 rounded hover:bg-amber-100 text-gray-700 font-medium">
                    Home
                </a>
                <a href="#" className="block px-4 py-2 rounded hover:bg-amber-100 text-gray-700 font-medium">
                    Profile
                </a>
                 {/* filter only for admin-role. */}
                {role === 'admin' && (
                    <a href="#" className="block px-4 py-2 rounded hover:bg-amber-100 text-gray-700 font-medium">
                        Student Management
                    </a>
                )}
                <button
                    onClick={onLogout}
                    className="block px-4 text-start w-full py-2 mt-6 text-red-500 hover:bg-red-100 rounded font-medium hover:cursor-pointer"
                >
                    Logout
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar