import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import PageMeta from "../../../Components/components/common/PageMeta";
import AppLayout from "../../../Layouts/layout/AppLayout";
import Pagination from "../../../Components/Pagination";
import Swal from 'sweetalert2';

export default function TeacherScheduleList({ schedules, filters }) {
    const [filterStatus, setFilterStatus] = useState(filters?.status || "all");
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [processingId, setProcessingId] = useState(null);

    // Handle status filter change - send request immediately
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setFilterStatus(newStatus);

        router.get('/schedule/list', {
            status: newStatus,
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== filters?.search) {
                router.get('/schedule/list', {
                    status: filterStatus,
                    search: searchTerm,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleClearSearch = () => {
        setSearchTerm("");
        router.get('/schedule/list', {
            status: filterStatus,
            search: "",
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle edit schedule
    const handleEdit = (scheduleId) => {
        router.visit(`/schedule/edit/${scheduleId}`);
    };

    // Handle delete schedule
    const handleDelete = (scheduleId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1b2d5a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setProcessingId(scheduleId);
                
                router.delete(`/schedule/${scheduleId}`, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setProcessingId(null);
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Schedule has been deleted successfully.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onError: (errors) => {
                        setProcessingId(null);
                        Swal.fire({
                            title: 'Error!',
                            text: errors.error || 'Failed to delete schedule. Please try again.',
                            icon: 'error',
                            confirmButtonColor: '#1b2d5a'
                        });
                    }
                });
            }
        });
    };

    // Handle info click for booked schedules
    const handleBookedInfo = () => {
        Swal.fire({
            title: 'Schedule is Booked',
            html: `
                <p class="text-gray-700 mb-4">
                    This schedule is currently booked and cannot be edited or deleted.
                </p>
                <p class="text-gray-600">
                    To modify this schedule, please go to <strong>Appointments</strong> and cancel the scheduled appointment first.
                </p>
            `,
            icon: 'info',
            confirmButtonText: 'Go to Appointments',
            showCancelButton: true,
            cancelButtonText: 'Close',
            confirmButtonColor: '#1b2d5a',
            cancelButtonColor: '#6b7280',
        }).then((result) => {
            if (result.isConfirmed) {
                router.visit('/appointments');
            }
        });
    };

    const getStatusColor = (status) => {
        const normalizedStatus = status?.toLowerCase();
        switch (normalizedStatus) {
            case "available":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "booked":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <AppLayout>
            <PageMeta
                title="Schedule List - Campus Reach"
                description="Manage your schedules"
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Schedule List
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    View and manage your schedules
                                </p>
                            </div>
                            <Link
                                href="/schedule/add"
                                className="px-6 py-3 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                                style={{ backgroundColor: '#1b2d5a' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Schedule
                            </Link>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by date or day..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': '#1b2d5a' }}
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <select
                                    value={filterStatus}
                                    onChange={handleStatusChange}
                                    className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': '#1b2d5a' }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {searchTerm && (
                                <button
                                    onClick={handleClearSearch}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Schedule List */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        {schedules?.data && schedules.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Day
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Duration
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {schedules.data.map((schedule) => (
                                            <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {formatDate(schedule.date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {schedule.day || 'No day'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {schedule.formatted_time}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {schedule.duration} min
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                                                        {schedule.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {schedule.status === 'booked' ? (
                                                        // Info icon for booked schedules - Click to show SweetAlert
                                                        <button
                                                            onClick={handleBookedInfo}
                                                            className="group relative inline-block focus:outline-none"
                                                        >
                                                            <svg 
                                                                className="w-5 h-5 text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors" 
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path 
                                                                    strokeLinecap="round" 
                                                                    strokeLinejoin="round" 
                                                                    strokeWidth={2} 
                                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                                                />
                                                            </svg>
                                                            {/* Tooltip on hover */}
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 pointer-events-none">
                                                                Click for more info
                                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                                    <div className="border-4 border-transparent border-t-gray-900"></div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ) : (
                                                        // Edit and Delete buttons for available schedules
                                                        <div className="flex gap-2">
                                                            {/* Edit Button - Pencil Icon */}
                                                            <button
                                                                onClick={() => handleEdit(schedule.id)}
                                                                disabled={processingId === schedule.id}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Edit schedule"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>

                                                            {/* Delete Button - Trash Icon */}
                                                            <button
                                                                onClick={() => handleDelete(schedule.id)}
                                                                disabled={processingId === schedule.id}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Delete schedule"
                                                            >
                                                                {processingId === schedule.id ? (
                                                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                    No schedules found
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm || filterStatus !== "all"
                                        ? "No schedules match your search criteria."
                                        : "You don't have any schedules yet."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination component - Pass current filters */}
                    <Pagination 
                        links={schedules?.links} 
                        filters={{
                            status: filterStatus,
                            search: searchTerm
                        }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
