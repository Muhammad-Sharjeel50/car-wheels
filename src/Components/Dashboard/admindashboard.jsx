import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link ,useNavigate } from 'react-router-dom';
import CarRegistration from '../Cars/AddCars';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
const SidebarComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return JSON.parse(localStorage.getItem('isSidebarOpen')) || false;
  });
  const [userData, setUserData] = useState([]);
  const [addCar, setAddCar] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for editing
  const token = localStorage.getItem('user');
  let API_URL = new URL(process.env.REACT_APP_API_URL).origin;
  const history = useNavigate();
  const decoded = jwtDecode(token);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/cars/get-cars/${decoded._id}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const toggleSidebarMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem('isSidebarOpen', JSON.stringify(!isSidebarOpen));
  };

  const carModal = () => {
    setAddCar(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user);
  };

  function Logout(){
    localStorage.clear();
   return  window.location.href = '/'
  }
  const handleSaveChanges = async () => {
    try {
      // Send edited user data to the server
      const response = await axios.put(`${API_URL}/v1/cars/update-cars/${selectedUser._id}`,{ ...selectedUser}, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.status === 200) {
        // Update user data after successful update
        toast.success('Updated')
        setUserData((prevUserData) =>
          prevUserData.map((user) => (user.id === selectedUser.id ? selectedUser : user))
        );
        fetchData()
        setSelectedUser(null); // Reset selectedUser after saving changes
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
   
  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete the ${user.name} ? `)) {
      axios.delete(`${API_URL}/v1/cars/delete-cars/${user._id}`)
        .then((response) => {
          fetchData();
          toast.success('User deleted successfully.');
        })
        .catch((error) => {
          // Handle error response, e.g., show an error message
          console.error(error);
          toast.error('Failed to delete user.');
          // Perform any additional actions if deletion fails
        });
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const name = localStorage.getItem('name');


  return (
    <div>
      <ToastContainer/>
      <div className="flex h-screen overflow-y-hidden bg-white">
        <div
          className={`fixed inset-0 z-10 bg-black bg-opacity-20 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
          style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
        ></div>

        <aside
          className={`fixed inset-y-0 z-10 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-white border-r shadow-lg lg:z-auto lg:static lg:shadow-none ${
            !isSidebarOpen ? '-translate-x-full lg:translate-x-0 lg:w-20' : ''
          }`}
        >
          <div className="flex items-center justify-between flex-shrink-0 p-2">
            <span className="p-2 bg-gradient-to-r text-transparent font-bold text-2xl font-mono from-blue-500 to-purple-500 bg-clip-text">
              C-W
            </span>
            <button onClick={toggleSidebarMenu} className="p-2 rounded-md lg:hidden">
              <svg
                className="w-6 h-6 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Sidebar links */}
          <nav className="flex-1 overflow-hidden hover:overflow-y-auto">
            <ul className="p-2 overflow-hidden">
              <li>
                <Link
                  href="#"
                  className="flex items-center p-2 space-x-2 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    // Handle sidebar link click
                  }}
                >
                  <span>
                    <svg
                      className="w-6 h-6 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </span>
                  <span className={!isSidebarOpen ? 'lg:hidden' : ''}>Dashboard</span>
                </Link>
              </li>
              {/* Other sidebar links */}
            </ul>
          </nav>
          {/* Sidebar footer */}
          <div className="flex-shrink-0 p-2 border-t max-h-14">
            <button
              className="flex items-center justify-center w-full px-4 py-2 space-x-1 font-medium tracking-wider uppercase bg-gray-100 border rounded-md focus:outline-none focus:ring"
              onClick={() => {
                Logout()
              }}
            >
              <span>
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              <span className={!isSidebarOpen ? 'lg:hidden' : ''} onClick={() => Logout()}> Logout </span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
          {/* Main content header */}
          <div className="flex flex-col items-start justify-between pb-6 space-y-4 border-b lg:items-center lg:space-y-0 lg:flex-row">
            <h1 className="bg-gradient-to-r text-transparent font-bold text-2xl font-mono from-blue-500 to-purple-500 bg-clip-text">Welcome,{name}</h1>
            <div>
            <button className="py-2 px-6 mr-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition font-medium duration-500" onClick={() => carModal()}>Add Vehicle </button>
            <button className="py-2 px-6 bg-red-500 text-white rounded hover:bg-red-700 transition font-medium duration-500" onClick={() => history('/dashboard')}>Dashboard</button>
          </div>
          </div>

          <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">

          </div>

          <h3 className="mt-6 text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">User Dashboard</h3>

          <div className="flex flex-col mt-6">
            { addCar ? <CarRegistration/> :
          <div className="flex flex-col mt-6">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 rounded-md shadow-md">
              <table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                  <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Reg No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Make
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                    Model
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Price
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">

                {userData.length > 0 ? userData.map((value,index)=>{
                          return(
                  <tr className="transition-all hover:bg-gray-100 hover:shadow-lg" key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        

                        <div className="ml-4" key={index}>
                          <div className="text-sm font-medium text-gray-900">{value.registrationNo}</div>
                          
                        </div>
                      
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{value.name}</div>                   
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-500">{value.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-500">{value.make}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-500">{value.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{value.price}$</td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      
                      <button class="py-2 px-6 bg-red-500 text-white rounded hover:bg-blue-700 transition font-medium duration-500" onClick={() => handleDeleteUser(value)}>DELETE</button>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      
                      <button class="py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-700 transition font-medium duration-500" onClick={() => handleEditUser(value)}>EDIT</button>
                    </td>
                  </tr>
                      )
                    }): <h1 className="text-xl text-center text-red-500">No Car Found</h1>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
}
          </div>
        </main>
        {selectedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 min-w-[50%] rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Reg No</label>
        <input
          type="text"
          name="registrationNo"
          value={selectedUser.registrationNo}
          onChange={handleInputChange}
          read only
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={selectedUser.name}

          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <input
          type="text"
          name="model"

          value={selectedUser.model}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Make</label>
        <input
          type="text"
          name="make"

          value={selectedUser.make}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={selectedUser.category}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="text"
          name="price"

          value={selectedUser.price}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {/* Add other input fields as needed */}
      <div className="flex justify-end mt-6">
        <button className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 mr-2" onClick={() => setSelectedUser(null)}>
          CANCEL
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSaveChanges}>
          UPDATE
        </button>
      </div>
    </div>
  </div>
)}



      </div>
    </div>
  );
};

export default SidebarComponent;
