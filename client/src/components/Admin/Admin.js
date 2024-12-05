import { Link } from 'react-router-dom';

function AdminPage() {
    return (
        <div className="admin flex flex-col items-center justify-top min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">
                Chào mừng quản trị viên!
            </h1>
            <div className="flex flex-col space-y-4">
                <Link to="/admin/addFlight">
                    <button className="px-6 py-3 w-64 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-400 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring focus:ring-blue-300">
                        Thêm chuyến bay
                    </button>
                </Link>
                <Link to="/admin/SetDelayTime">
                    <button className="px-6 py-3 w-64 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-400 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring focus:ring-blue-300">
                        Đổi giờ khởi hành
                    </button>
                </Link>
                <Link to="/admin/addAircraft">
                    <button className="px-6 py-3 w-64 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-400 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring focus:ring-blue-300">
                        Thêm máy bay
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default AdminPage;
