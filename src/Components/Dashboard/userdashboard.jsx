import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const SidebarComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return JSON.parse(localStorage.getItem('isSidebarOpen')) || false;
  });
  const [userData, setUserData] = useState([]);
  const token = localStorage.getItem('user');
  const API_URL = new URL(process.env.REACT_APP_API_URL).origin;
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const history = useNavigate();
  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/cars/all-cars`, {
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

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const pageCount = Math.ceil(userData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = userData.slice(offset, offset + itemsPerPage);

  const toggleSidebarMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem('isSidebarOpen', JSON.stringify(!isSidebarOpen));
  };

  function Logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  const name = localStorage.getItem('name');

  return (
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
                to="/user/dashboard"
                className="flex items-center p-2 space-x-2 rounded-md hover:bg-gray-100"
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
            onClick={Logout}
          >
            <span className={!isSidebarOpen ? 'lg:hidden' : ''}> Logout </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
        {/* Main content header */}
        <div className="flex flex-col items-start justify-between pb-6 space-y-4 border-b lg:items-center lg:space-y-0 lg:flex-row">
          <h1 className="bg-gradient-to-r text-transparent font-bold text-2xl font-mono from-blue-500 to-purple-500 bg-clip-text">Welcome, {name}</h1>
          <div>
            <button className="py-2 px-6 bg-red-500 mr-2 text-white rounded hover:bg-red-700 transition font-medium duration-500" onClick={() => history('/user/dashboard')}>Dashboard</button>
            <button className="py-2 px-6 mr-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition font-medium duration-500" onClick={Logout} >Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Display your other components here */}
        </div>

        <h3 className="mt-6 text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">Car Wheels (Registered Cars)</h3>

        <div className="flex flex-col mt-6">
          <div className="flex flex-col mt-6">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden border-b border-gray-200 rounded-md shadow-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPageData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {currentPageData.map((value, index) => (
                            <div
                              key={index}
                              className="rounded-lg shadow-lg overflow-hidden bg-white"
                            >
                              <img
                                alt="Placeholder"
                                className="block w-full h-[300px]"
                                src={`${API_URL}/${value.image}`}
                              />
                              <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h1 className="text-xl font-bold">{value.name}</h1>
                                  <p className="text-gray-600">{value.price}<span className="font-bold text-lg text-red-500">$</span></p>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <p className="font-bold text-blue-600">Make:</p>
                                  <p>{value.make}</p>
                                  <p className="font-bold text-blue-600">Model:</p>
                                  <p>{value.model}</p>
                                  <p className="font-bold text-blue-600">Category:</p>
                                  <p>{value.category}</p>
                                  <p className="font-bold text-blue-600">Color:</p>
                                  <p>{value.color}</p>
                                  <p className="font-bold text-blue-600">Registration No:</p>
                                  <p>{value.registrationNo}</p>
                                  {/* Add more labels and values here */}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No data available</p>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex justify-center my-6">
  <ReactPaginate
    previousLabel={'←'}
    nextLabel={'→'}
    breakLabel={'...'}
    pageCount={pageCount}
    marginPagesDisplayed={2}
    pageRangeDisplayed={5}
    onPageChange={handlePageChange}
    containerClassName={'flex'}
    previousLinkClassName={'rounded-full w-[40px] h-[40px]-full border border-blue-300  p-2 mr-2 hover:bg-gray-200'}
    nextLinkClassName={'rounded-full w-[40px] pr-2 pl-2 h-[40px] border  border-blue-300 p-2  hover:bg-gray-200'}
    disabledClassName={' cursor-not-allowed'}
    activeClassName={'active w-[30px] h-[30px] mr-4 text-center rounded-full text-lg bg-blue-500 text-white'}
  />
</div>

      </main>
    </div>
  );
};

export default SidebarComponent;
