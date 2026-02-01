import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import PageMeta from "../../../Components/components/common/PageMeta";
import AppLayout from "../../../Layouts/layout/AppLayout";
import Pagination from "../../../Components/Pagination";
import Swal from 'sweetalert2';
import { Modal, Button } from 'antd';

export default function StudentAppointmentList({ appointments, filters }) {
	const [filterStatus, setFilterStatus] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");

	const [processingId, setProcessingId] = useState(null);
	const [completedIds, setCompletedIds] = useState([]);

	const [showNotesModal, setShowNotesModal] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [notes, setNotes] = useState("");

	// Handle status filter change - send request immediately
	const handleStatusChange = (e) => {
		const newStatus = e.target.value;
		setFilterStatus(newStatus);

		router.get('/student/appointments', {
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
				router.get('/student/appointments', {
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
		router.get('/student/appointments', {
			status: filterStatus,
			search: "",
		}, {
			preserveState: true,
			preserveScroll: true,
		});
	};

	const handleAddNotesClick = (appointment) => {
		setSelectedAppointment(appointment);
		setNotes(appointment.notes || "");
		setShowNotesModal(true);
	};

	const getStatusColor = (status) => {
		const normalizedStatus = status?.toLowerCase();
		switch (normalizedStatus) {
			case "approved":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "cancelled":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "completed":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
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

	const formatTime = (timeString) => {
		if (!timeString) return '';
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const displayHour = hour % 12 || 12;
		return `${displayHour}:${minutes} ${ampm}`;
	};

	return (
		<AppLayout>
			<PageMeta
				title="Appointment List - Campus Reach"
				description="Manage your appointments"
			/>
			<div className="grid grid-cols-12 gap-4 md:gap-6">
				<div className="col-span-12">
					<div className="mb-6">
						<div className="flex justify-between items-center">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
									Appointment List
								</h1>
								<p className="text-gray-600 dark:text-gray-400">
									Your appointments with teachers.
								</p>
							</div>
						</div>
					</div>

					{/* Filters and Search */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
						<div className="flex flex-col md:flex-row gap-4">
							

							{/* Status Filter */}
							<div className="flex justify-end">
                                <select
                                    value={filterStatus}
                                    onChange={handleStatusChange}
                                    className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': '#1b2d5a' }}
                                >
                                    <option value="all">All Status</option>
									<option value="pending">Pending</option>
									<option value="approved">Approved</option>
									<option value="completed">Completed</option>
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

					{/* Appointments List */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
						{appointments?.data && appointments.data.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50 dark:bg-gray-700">
										<tr>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
												Teacher
											</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
												Title
											</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
												Date
											</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
												Time
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
										{appointments.data.map((appointment) => (
											<tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														{appointment.teacher_avatar ? (
															<img
																src={appointment.teacher_avatar}
																alt={appointment.teacher_name}
																className="w-10 h-10 rounded-full object-cover"
															/>
														) : (
															<div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold">
																<span className="text-lg">
																	{appointment.teacher_name?.charAt(0)?.toUpperCase() || 'T'}
																</span>
															</div>
														)}
														<div className="ml-4">
															<div className="text-sm font-medium text-gray-900 dark:text-white">
																{appointment.teacher_name || 'Unknown Teacher'}
															</div>
															<div className="text-sm text-gray-500 dark:text-gray-400">
																{appointment.teacher_email}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-900 dark:text-white">
														{appointment.title || 'No title'}
													</div>
													{appointment.description && (
														<div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
															{appointment.description}
														</div>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 dark:text-white">
														{formatDate(appointment.date)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 dark:text-white">
														{formatTime(appointment.time)}
													</div>
													{appointment.duration && (
														<div className="text-sm text-gray-500 dark:text-gray-400">
															{appointment.duration} min
														</div>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
														{appointment.status}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													<div className="flex gap-2">
														{/* Show only add notes if completed */}
														{((appointment.status?.toLowerCase() === 'completed') || completedIds.includes(appointment.id)) ? (
															<button
																className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
																title="Add notes"
																onClick={() => handleAddNotesClick(appointment)}
															>
																<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
																</svg>
															</button>
														) : (
															<>
																{appointment.zoom_link && (
																	<a
																		href={appointment.zoom_link}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
																		title="Join Zoom Meeting"
																	>
																		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
																		</svg>
																	</a>
																)}
															</>
														)}
													</div>
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
									No appointments
								</h3>
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
									{searchTerm || filterStatus !== "all"
										? "No appointments match your search criteria."
										: "You don't have any appointments yet."}
								</p>
							</div>
						)}
					</div>

					{/* Pagination component - Pass current filters */}
					<Pagination 
						links={appointments?.links} 
						filters={{
							status: filterStatus,
							search: searchTerm
						}}
					/>

					<Modal
						title="Notes"
						open={showNotesModal}
						onCancel={() => setShowNotesModal(false)}
						destroyOnHidden
						styles={{ body: { paddingTop: 8 } }}
						footer={null} 
					>
						<p className="mb-2 text-gray-700 dark:text-gray-300">
							Notes added by <span className="font-semibold">{selectedAppointment?.teacher_name}</span>
						</p>
						<textarea
							className="w-full border border-gray-300 rounded-lg p-2 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							rows={15}
							placeholder="Enter your notes here..."
							value={notes}
							onChange={e => setNotes(e.target.value)}
							style={{ resize: "none" }}
							readOnly={true}
						/>
					</Modal>
				</div>
			</div>
		</AppLayout>
	);
}
