import { useState } from "react";
import PageMeta from "../../Components/components/common/PageMeta";
import AppLayout from "../../Layouts/layout/AppLayout";

export default function UnattendedList({ appointments }) {
	const [searchTerm, setSearchTerm] = useState("");

	// Filter appointments based on search
	const filteredAppointments = appointments?.filter((appointment) =>
		appointment.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		appointment.title?.toLowerCase().includes(searchTerm.toLowerCase())
	) || [];

	const getStatusBadgeClass = (status) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
			case 'approved':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			case 'rejected':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
			case 'cancelled':
				return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
			default:
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
		}
	};

	return (
		<AppLayout>
			<PageMeta
				title="Unattended Appointments - Campus Reach"
				description="View your unattended appointments"
			/>
			<div className="grid grid-cols-12 gap-4 md:gap-6">
				<div className="col-span-12">
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Unattended List
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							View and manage your pending and unattended appointments
						</p>
					</div>

					{/* Search Bar */}
					<div className="mb-6">
						<input
							type="text"
							placeholder="Search appointments..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
					</div>

					{/* Appointments Table */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
											Teacher
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
											Date & Time
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
											Duration
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
									{filteredAppointments.length > 0 ? (
										filteredAppointments.map((appointment) => (
											<tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="flex-shrink-0 h-10 w-10">
															<div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
																<span className="text-white font-medium">
																	{appointment.teacher_name?.charAt(0) || 'T'}
																</span>
															</div>
														</div>
														<div className="ml-4">
															<div className="text-sm font-medium text-gray-900 dark:text-white">
																{appointment.teacher_name || 'Unknown Teacher'}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 dark:text-white">
														{appointment.date || 'N/A'}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{appointment.start_time || 'N/A'}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
													{appointment.duration || 'N/A'}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
														{appointment.status || 'Pending'}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<button className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-3">
														View
													</button>
													{appointment.status === 'pending' && (
														<button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
															Cancel
														</button>
													)}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan="5" className="px-6 py-12 text-center">
												<div className="text-gray-500 dark:text-gray-400">
													{searchTerm ? 'No appointments found matching your search.' : 'You have no appointments at the moment.'}
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>

					{/* Summary Stats */}
					{filteredAppointments.length > 0 && (
						<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
								<h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Pending</h3>
								<p className="mt-1 text-2xl font-semibold text-yellow-900 dark:text-yellow-200">
									{appointments?.filter(a => a.status === 'pending').length || 0}
								</p>
							</div>
							<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
								<h3 className="text-sm font-medium text-green-800 dark:text-green-300">Approved</h3>
								<p className="mt-1 text-2xl font-semibold text-green-900 dark:text-green-200">
									{appointments?.filter(a => a.status === 'approved').length || 0}
								</p>
							</div>
							<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
								<h3 className="text-sm font-medium text-gray-800 dark:text-gray-300">Total</h3>
								<p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-200">
									{appointments?.length || 0}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	);
}
