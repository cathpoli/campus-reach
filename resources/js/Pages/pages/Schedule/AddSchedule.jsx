import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import PageMeta from "../../../Components/components/common/PageMeta";
import AppLayout from "../../../Layouts/layout/AppLayout";
import Swal from 'sweetalert2';

export default function AddSchedule() {
	const { data, setData, post, processing, errors } = useForm({
		start_date_time: '',
		end_date_time: '',
		repeat_yearly: false,
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Validation
		if (!data.start_date_time || !data.end_date_time) {
			Swal.fire({
				title: 'Error!',
				text: 'Please fill in both start and end date/time.',
				icon: 'error',
				confirmButtonColor: '#1b2d5a',
				customClass: {
					container: 'swal-z-index'
				}
			});
			return;
		}

		// Check if end datetime is after start datetime
		if (new Date(data.end_date_time) < new Date(data.start_date_time)) {
			Swal.fire({
				title: 'Error!',
					text: 'End date/time must be after start date/time.',
				icon: 'error',
				confirmButtonColor: '#1b2d5a',
				customClass: {
					container: 'swal-z-index'
				}
			});
			return;
		}

		Swal.fire({
			title: 'Are you sure?',
			text: "Do you want to save this schedule?",
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#1b2d5a',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Yes, save it!',
			cancelButtonText: 'Cancel',
			customClass: {
				container: 'swal-z-index'
			}
		}).then((result) => {
			if (result.isConfirmed) {
				post('/schedule/add', {
					onSuccess: () => {
						Swal.fire({
							title: 'Success!',
							text: 'Schedule has been added successfully.',
							icon: 'success',
							timer: 2000,
                            showConfirmButton: false,
							customClass: {
								container: 'swal-z-index'
							}
						}).then(() => {
							router.visit('/schedule/list');
						});
					},
					onError: () => {
						Swal.fire({
							title: 'Error!',
							text: 'There was an error saving the schedule. Please try again.',
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

	const handleClose = () => {
		router.visit('/schedule/list');
	};

	return (
		<AppLayout>
			<PageMeta
				title="Add Schedule - Campus Reach"
				description="Add a new schedule"
			/>
			<div className="grid grid-cols-12 gap-4 md:gap-6">
				<div className="col-span-12">
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Add Schedule
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Create a new schedule for your availability
						</p>
					</div>

					{/* Form Container */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
						<form onSubmit={handleSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Start Date and Time */}
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Select a start date and time
									</label>
									<input
										type="datetime-local"
										value={data.start_date_time}
										onChange={(e) => setData('start_date_time', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2"
										style={{ '--tw-ring-color': '#1b2d5a' }}
									/>
									{errors.start_date_time && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.start_date_time}
										</p>
									)}
								</div>

								{/* End Date and Time */}
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Select an end date and time
									</label>
									<input
										type="datetime-local"
										value={data.end_date_time}
										onChange={(e) => setData('end_date_time', e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2"
										style={{ '--tw-ring-color': '#1b2d5a' }}
									/>
									{errors.end_date_time && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.end_date_time}
										</p>
									)}
								</div>
							</div>

							{/* Buttons */}
							<div className="flex justify-end gap-3 mt-8">
								<button
									type="button"
									onClick={handleClose}
									className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
								>
									Close
								</button>
								<button
									type="submit"
									disabled={processing}
									className="px-6 py-3 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
									style={{ backgroundColor: '#1b2d5a' }}
								>
									{processing ? 'Submitting...' : 'Submit'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
