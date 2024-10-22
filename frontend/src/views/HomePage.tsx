import { logout } from "../utils/auth";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <button
                    onClick={logout}
                    className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded font-medium text-sm hover:bg-red-700 transition duration-200"
                >
                    Logout
                </button>
                <h1 className="text-4xl font-bold text-indigo-600 mb-6">
                    Welcome to the Application!
                </h1>
            </div>
        </div> 
    )
}
export default HomePage;