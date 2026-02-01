import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AppLayout from "../../../Layouts/layout/AppLayout";
import Swal from 'sweetalert2';

export default function StudentCalendar({ events = [] }) {
	const [currentDate, setCurrentDate] = useState(new Date());

	// Handle event click
	const handleEventClick = (event) => {
		// Extract date from event.start (format: YYYY-MM-DD)
		const eventDate = event.start.split('T')[0];
		const today = new Date();
		const todayStr = today.toISOString().split('T')[0];
		const isFutureEvent = eventDate > todayStr;

		// Parse the date properly - handle both "YYYY-MM-DD HH:MM:SS" and "YYYY-MM-DDTHH:MM:SS" formats
		const startDateTime = event.start.replace(' ', 'T'); // Ensure proper ISO format
		const startDate = new Date(startDateTime);
		
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		const dateStr = startDate.toLocaleDateString('en-US', options);

		const swalOptions = {
			title: 'Heads up!',
			html: `
				<div class="text-center">
					<p class="mb-4">You booked an appointment on ${event.start_time} to ${event.end_time} with <b>${event.teacher_name}</b></p>
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
							<li>• If the teacher is idle or unattended after 10 minutes you may leave the meeting.</li>
						</ul>
					</div>
				</div>
			`,
			icon: 'info',
			showConfirmButton: false,
			customClass: {
				container: 'swal-z-index'
			}
		};

		// Add cancel button only if event is in the future
		// if (isFutureEvent) {
		// 	swalOptions.showDenyButton = true;
		// 	swalOptions.denyButtonColor = '#ef4444';
		// 	swalOptions.denyButtonText = 'Cancel Appointment';
		// }

		Swal.fire(swalOptions).then((result) => {
			if (result.isDenied) {
				handleCancelAppointment(event.id);
			}
		});
	};

	// Get events for a specific day
	const getEventsForDay = (day) => {
		if (!day) return [];
		const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return events.filter(event => event.start.startsWith(dateStr));
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

	const monthDays = getMonthDays();
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];
	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

	return (
		<AppLayout>

			<div className="grid grid-cols-12 gap-4 md:gap-6">
				<div className="col-span-12">
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Dashboard
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Manage your schedule and appointments
						</p>
					</div>

					{/* Calendar Container */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
						{/* Calendar Header */}
						<div className="flex justify-between items-center mb-6">
							{/* Navigation Controls */}
							<div className="flex items-center gap-2">
								<button
									onClick={() => navigateCalendar(-10)}
									className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
									title="Fast backward"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
									</svg>
								</button>
								<button
									onClick={() => navigateCalendar(-1)}
									className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
									title="Previous"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
								</button>
								<button
									onClick={goToToday}
									className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm font-medium"
								>
									today
								</button>
								<button
									onClick={() => navigateCalendar(1)}
									className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
									title="Next"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</button>
								<button
									onClick={() => navigateCalendar(10)}
									className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
									title="Fast forward"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
									</svg>
								</button>
							</div>
						</div>

						{/* Month View Calendar */}
						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
								{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
							</h2>
							
							{/* Calendar Grid */}
							<div className="grid grid-cols-7 gap-1">
								{/* Day headers */}
								{dayNames.map((day) => (
									<div
										key={day}
										className="text-center font-semibold text-gray-700 dark:text-gray-300 py-2 border-b-2 border-gray-300 dark:border-gray-600"
									>
										{day}
									</div>
								))}
								
								{/* Calendar days */}
								{monthDays.map((day, index) => {
									const dayEvents = getEventsForDay(day);
									return (
										<div
											key={index}
											className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 ${
												day ? "bg-gray-50 dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-800"
											} ${isToday(day) ? "ring-2 ring-blue-500" : ""}`}
										>
											{day && (
												<>
													<div className={`text-sm font-medium mb-1 ${
														isToday(day) 
															? "bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center" 
															: "text-gray-900 dark:text-white"
													}`}>
														{day}
													</div>
													{/* Display events for this day */}
													{dayEvents.map((event) => (
														<div
															key={event.id}
														className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded mb-1 truncate cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
														title={`You booked an appointment on ${event.start_time} to ${event.end_time} with ${event.teacher_name}`}
														onClick={() => handleEventClick(event)}
														>
															{event.start_time} - {event.teacher_name}
														</div>
													))}
												</>
											)}
										</div>
									);
								})}
							</div>
						</div>					
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
