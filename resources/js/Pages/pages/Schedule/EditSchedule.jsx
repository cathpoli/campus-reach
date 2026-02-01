import { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import PageMeta from "../../../Components/components/common/PageMeta";
import AppLayout from "../../../Layouts/layout/AppLayout";
import Swal from 'sweetalert2';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

export default function EditSchedule({ schedule }) {
    const [duration, setDuration] = useState(0);
	const [showStartTime, setShowStartTime] = useState(false);
	const [showEndTime, setShowEndTime] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        date: schedule?.date || '',
        start_time: schedule?.start_time || '',
    	end_time: schedule?.end_time || '',
        duration: schedule?.duration || 0,
    });

    // Calculate duration when times change
    useEffect(() => {
        if (data.start_time && data.end_time) {
            const [startHour, startMin] = data.start_time.split(':').map(Number);
            const [endHour, endMin] = data.end_time.split(':').map(Number);
            
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            
            const calculatedDuration = endMinutes - startMinutes;
            setDuration(calculatedDuration);
            setData('duration', calculatedDuration);
        }
    }, [data.start_time, data.end_time]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!data.date || !data.start_time || !data.end_time) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill in all required fields.',
                icon: 'error',
                confirmButtonColor: '#1b2d5a',
            });
            return;
        }

        // Check if end time is after start time
        if (data.end_time <= data.start_time) {
            Swal.fire({
                title: 'Error!',
                text: 'End time must be after start time.',
                icon: 'error',
                confirmButtonColor: '#1b2d5a',
            });
            return;
        }

        // Check if duration is valid
        if (data.duration < 15) {
            Swal.fire({
                title: 'Error!',
                text: 'Duration must be at least 15 minutes.',
                icon: 'error',
                confirmButtonColor: '#1b2d5a',
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to update this schedule?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1b2d5a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                put(`/schedule/${schedule.id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Schedule has been updated successfully.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                        }).then(() => {
                            router.visit('/schedule/list');
                        });
                    },
                    onError: (errors) => {
                        const errorMessage = errors.error || 'There was an error updating the schedule. Please try again.';
                        Swal.fire({
                            title: 'Error!',
                            text: errorMessage,
                            icon: 'error',
                            confirmButtonColor: '#1b2d5a',
                        });
                    }
                });
            }
        });
    };

    const handleCancel = () => {
        Swal.fire({
            title: 'Discard changes?',
            text: "Any unsaved changes will be lost.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, discard',
            cancelButtonText: 'Continue editing',
        }).then((result) => {
            if (result.isConfirmed) {
                router.visit('/schedule/list');
            }
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });
    };

    const onChange = (time, timeString) => {
        console.log('Selected Time:', timeString);
    };

    return (
        <AppLayout>
            <PageMeta
                title="Edit Schedule - Campus Reach"
                description="Edit schedule"
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => router.visit('/schedule/list')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Edit Schedule
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Update your schedule for your availability
                        </p>
                    </div>

                    {/* Current Schedule Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                    Current Schedule
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Date:</strong> {formatDate(schedule.date)}
                                </p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Time:</strong> {schedule.formatted_time}
                                </p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Duration:</strong> {schedule.duration} minutes
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6">
                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2"
                                        style={{ '--tw-ring-color': '#1b2d5a' }}
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>

                                {/* Time Range */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Start Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Start Time <span className="text-red-500">*</span>
                                        </label>
                                        <TimePicker
                                            use12Hours
                                            format="h:mm a"
                                            value={data.start_time ? dayjs(data.start_time, 'HH:mm') : null}
                                            placeholder="Select time"
                                            onChange={(time) => setData('start_time', time ? time.format('HH:mm') : '')}
                                            className="w-full"
                                            popupClassName="z-50"
                                            changeOnScroll
                                            defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
                                            allowClear={false}
                                        />
                                        {errors.start_time && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.start_time}
                                            </p>
                                        )}
                                    </div>

                                    {/* End Time */}
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											End Time <span className="text-red-500">*</span>
										</label>
										<TimePicker
                                            use12Hours
                                            format="h:mm a"
                                            value={data.end_time ? dayjs(data.end_time, 'HH:mm') : null}
                                            placeholder="Select time"
                                            onChange={(time) => setData('end_time', time ? time.format('HH:mm') : '')}
                                            className="w-full"
                                            popupClassName="z-50"
                                            changeOnScroll
                                            defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
                                            allowClear={false}
                                        />
										{errors.end_time && (
											<p className="mt-1 text-sm text-red-600 dark:text-red-400">
												{errors.end_time}
											</p>
										)}
									</div>
                                </div>

                                {/* Duration Display */}
                                {duration > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Calculated Duration
                                                </p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {duration} minutes ({Math.floor(duration / 60)}h {duration % 60}m)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {errors.duration && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.duration}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={processing}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    style={{ backgroundColor: '#1b2d5a' }}
                                >
                                    {processing && (
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {processing ? 'Updating...' : 'Update Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}