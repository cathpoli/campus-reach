import { useState } from "react";
import { Link } from "@inertiajs/react";
import PageMeta from "../../../../Components/components/common/PageMeta";
import AppLayout from "../../../../Layouts/layout/AppLayout";
import Swal from 'sweetalert2';

export default function StudentDashboard({ teachers, events = [] }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentDate, setCurrentDate] = useState(new Date());

	// Handle event click
	const handleEventClick = (event) => {
		// Parse the date properly - handle both "YYYY-MM-DD HH:MM:SS" and "YYYY-MM-DDTHH:MM:SS" formats
		const startDateTime = event.start.replace(' ', 'T'); // Ensure proper ISO format
		const startDate = new Date(startDateTime);
		const endTime = event.end.includes('T') ? event.end.split('T')[1] : event.end.split(' ')[1];
		const startTimeStr = event.start.includes('T') ? event.start.split('T')[1] : event.start.split(' ')[1];
		
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		const dateStr = startDate.toLocaleDateString('en-US', options);

		Swal.fire({
			title: 'Heads up!',
			html: `
				<div class="text-center">
					<p class="mb-4">Student Test booked an appointment on ${dateStr} ${startTimeStr} to ${endTime}</p>
					${event.zoom_link ? `
						<div class="mb-4 text-left">
							<p class="font-medium mb-2">Zoom Link :</p>
							<a href="${event.zoom_link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline break-all">${event.zoom_link}</a>
						</div>
					` : ''}
					<div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-left">
						<p class="font-semibold text-cyan-900 mb-2">REMINDER :</p>
						<ul class="text-sm text-cyan-800 space-y-1">
							<li>• You can cancel your appointment ahead of time.</li>
							<li>• If the student is idle or unattended after 10 minutes you may leave the meeting.</li>
						</ul>
					</div>
				</div>
			`,
			icon: 'info',
			confirmButtonColor: '#00bcd4',
			confirmButtonText: 'OK',
			customClass: {
				container: 'swal-z-index'
			}
		});
	};

	// Calendar navigation
	const navigateCalendar = (direction) => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + direction);
		setCurrentDate(newDate);
	};

	const goToToday = () => {
		setCurrentDate(new Date());
	};

	// Get calendar days for month view
	const getMonthDays = () => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];
		// Add empty cells for days before the month starts
		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(null);
		}
		// Add all days in the month
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(day);
		}
		return days;
	};

	// Get events for a specific day
	const getEventsForDay = (day) => {
		if (!day) return [];
		const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return events.filter(event => event.start.startsWith(dateStr));
	};

	// Check if a day is today
	const isToday = (day) => {
		if (!day) return false;
		const today = new Date();
		return (
			day === today.getDate() &&
			currentDate.getMonth() === today.getMonth() &&
			currentDate.getFullYear() === today.getFullYear()
		);
	};

	const monthDays = getMonthDays();
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];
	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	// Filter teachers based on search term
	const filteredTeachers = teachers?.filter((teacher) => {
		const searchLower = searchTerm.toLowerCase();
		const teacherName = teacher.profile
			? `${teacher.profile.first_name || ''} ${teacher.profile.last_name || ''}`.toLowerCase()
			: teacher.name?.toLowerCase() || '';
		const email = teacher.email?.toLowerCase() || '';
		const phone = teacher.profile?.phone?.toLowerCase() || '';
		
		return teacherName.includes(searchLower) || 
			   email.includes(searchLower) || 
			   phone.includes(searchLower);
	}) || [];

	return (
		<AppLayout>
			<PageMeta
				title="Student Dashboard - Campus Reach"
				description="Campus Reach Student Dashboard"
			/>
			<div className="grid grid-cols-12 gap-4 md:gap-6">
				<div className="col-span-12">
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Dashboard
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Find and connect with your teachers
						</p>
					</div>

					{/* Search Bar */}
					<div className="mb-6">
						<input
							type="text"
							placeholder="Search by name, email, or phone..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2"
							style={{ '--tw-ring-color': '#1b2d5a' }}
						/>
					</div>

				{/* Teachers Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredTeachers && filteredTeachers.length > 0 ? (
						filteredTeachers.map((teacher) => (
								<div
									key={teacher.id}
									className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center"
								>
									{/* Avatar */}
									<div className="mb-4">
										<div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#1b2d5a' }}>
											<div className="w-full h-full flex items-center justify-center">
												<span className="text-4xl font-bold text-white">
													{(() => {
														// Get initials from profile or name
														const firstName = teacher.profile?.first_name || '';
														const lastName = teacher.profile?.last_name || '';
														if (firstName || lastName) {
															return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
														}
														// Fallback: use first two letters of teacher.name
														const name = teacher.name || '';
														const parts = name.split(' ');
														if (parts.length >= 2) {
															return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
														}
														return name.slice(0, 2).toUpperCase();
													})()}
												</span>
											</div>
										</div>
									</div>

									{/* Teacher Info */}
									<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
										{teacher.profile
											? `${teacher.profile.first_name || ''} ${teacher.profile.last_name || ''}`
											: teacher.name}
									</h3>
									<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
										{teacher.email}
									</p>

									{/* Action Buttons */}
									<div className="flex gap-2 w-full mt-auto">
										<Link
											href={`/chat/${teacher.id}`}
												className="flex-1 px-4 py-2 text-white text-center rounded-lg transition-colors text-sm font-medium"
												style={{ backgroundColor: '#1b2d5a' }}
										>
											Chat
										</Link>
										<Link
											href={`/appointment/book/${teacher.id}`}
										className="flex-1 px-4 py-2 text-white text-center rounded-lg transition-colors text-sm font-medium"
										style={{ backgroundColor: '#6b7280' }}
										>
											Book an Appointment
										</Link>
									</div>
								</div>
							))
						) : (
							<div className="col-span-full text-center py-12">
								<p className="text-gray-600 dark:text-gray-400">
									{searchTerm 
										? `No teachers found matching "${searchTerm}".` 
										: "No teachers available at the moment."}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
