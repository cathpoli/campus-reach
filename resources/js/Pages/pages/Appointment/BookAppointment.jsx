import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import AppLayout from "../../../Layouts/layout/AppLayout";
import PageMeta from "../../../Components/components/common/PageMeta";
import Swal from 'sweetalert2';

export default function BookAppointment({ teacher, schedules = [] }) {
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const { data, setData, post, processing, errors } = useForm({
		schedule_id: '',
		teacher_id: teacher.id,
		title: '',
		notes: ''
	});

	// Group schedules by date
	const groupedSchedules = schedules.reduce((acc, schedule) => {
		const date = schedule.date;
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(schedule);
		return acc;
	}, {});

	// Format date to readable format
	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		return date.toLocaleDateString('en-US', options);
	};

	// Format time
	const formatTime = (datetime) => {
		const date = new Date(datetime);
		return date.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: true 
		});
	};

	const handleScheduleSelect = (schedule) => {
		setSelectedSchedule(schedule);
		setData('schedule_id', schedule.schedule_id);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!selectedSchedule) {
			Swal.fire({
				title: 'Error!',
				text: 'Please select a time slot',
				icon: 'error',
				confirmButtonColor: '#1b2d5a',
				customClass: {
					container: 'swal-z-index'
				}
			});
			return;
		}

		Swal.fire({
			title: 'Book this appointment?',
			text: `${formatDate(selectedSchedule.date)} at ${formatTime(selectedSchedule.start_date_time)} - ${formatTime(selectedSchedule.end_date_time)}`,
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#1b2d5a',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Yes, book it!',
			cancelButtonText: 'Cancel',
			customClass: {
				container: 'swal-z-index'
			}
		}).then((result) => {
			if (result.isConfirmed) {
				post('/appointment/store', {
					onSuccess: () => {
						Swal.fire({
							title: 'Success!',
							text: 'Appointment booked successfully',
							icon: 'success',
							confirmButtonColor: '#1b2d5a',
							customClass: {
								container: 'swal-z-index'
							}
						}).then(() => {
							router.visit('/dashboard');
						});
					},
					onError: () => {
						Swal.fire({
							title: 'Error!',
							text: 'Failed to book appointment. Please try again.',
							icon: 'error',
							confirmButtonColor: '#1b2d5a',
							customClass: {
								container: 'swal-z-index'
							}
						});
					}
				});
			}
		});
	};

	return (
		<AppLayout>
			<PageMeta 
				title="Book Appointment"
				description="Book an appointment with your teacher"
			/>
			
			<div className="max-w-4xl mx-auto">
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
					{/* Header */}
					<div className="p-6 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
							Make an appointment to {teacher.profile?.first_name || teacher.profile?.firstname || 'Mr./Ms.'} {teacher.profile?.last_name || teacher.profile?.lastname || 'Teacher'}
						</h2>
					</div>

					{/* Content */}
					<div className="p-6">
						{Object.keys(groupedSchedules).length > 0 ? (
							<div className="space-y-6">
								{Object.entries(groupedSchedules).map(([date, daySchedules]) => (
									<div key={date} className="space-y-3">
										<h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
											Available time for {formatDate(date)}
										</h3>
										<div className="flex flex-wrap gap-3">
											{daySchedules.map((schedule) => (
												<button
													key={schedule.schedule_id}
													type="button"
													onClick={() => handleScheduleSelect(schedule)}
													disabled={schedule.status !== 'available'}
													className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
														selectedSchedule?.schedule_id === schedule.schedule_id
															? 'bg-[#1b2d5a] text-white border-[#1b2d5a]'
															: schedule.status === 'available'
															? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#1b2d5a]'
															: 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800 cursor-not-allowed'
													}`}
												>
													{formatTime(schedule.start_date_time)} to {formatTime(schedule.end_date_time)}
												</button>
											))}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<p className="text-gray-600 dark:text-gray-400">
									No available schedules at the moment.
								</p>
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
						<button
							type="button"
							onClick={() => router.visit('/dashboard')}
							className="px-6 py-2.5 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
						>
							Close
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!selectedSchedule || processing}
							className="px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							style={{ backgroundColor: '#1b2d5a' }}
						>
							{processing ? 'Submitting...' : 'Submit'}
						</button>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
