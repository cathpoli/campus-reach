import { useForm, Link, router } from "@inertiajs/react";
import AppLayout from "../../../Layouts/layout/AppLayout";
import PageMeta from "../../../Components/components/common/PageMeta";
import Swal from 'sweetalert2';

export default function AddStudent() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        extension: '',
        email: '',
        student_number: '',
        contact_number: '',
        gender: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save this student?",
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
                post('/users/students', {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Student has been added successfully.',
                            icon: 'success',
                            confirmButtonColor: '#1b2d5a',
                            confirmButtonText: 'Okay',
                            customClass: {
                                container: 'swal-z-index'
                            }
                        }).then(() => {
                            router.visit('/users/students');
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'There was an error saving the student. Please check the form and try again.',
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
                title="Add Student - Campus Reach"
                description="Add a new student account"
            />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Add New Student
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create a new student account
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">
                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        required
                                    />
                                    {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        required
                                    />
                                    {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                                </div>
                            </div>

                            {/* Middle Name & Extension */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.middle_name}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    {errors.middle_name && <p className="mt-1 text-xs text-red-500">{errors.middle_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Extension
                                    </label>
                                    <input
                                        type="text"
                                        value={data.extension}
                                        onChange={(e) => setData('extension', e.target.value)}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    {errors.extension && <p className="mt-1 text-xs text-red-500">{errors.extension}</p>}
                                </div>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            {/* Student Number & Contact Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Student Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.student_number}
                                        onChange={(e) => setData('student_number', e.target.value)}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        required
                                    />
                                    {errors.student_number && <p className="mt-1 text-xs text-red-500">{errors.student_number}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_number}
                                        onChange={(e) => setData('contact_number', e.target.value)}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        required
                                    />
                                    {errors.contact_number && <p className="mt-1 text-xs text-red-500">{errors.contact_number}</p>}
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
                            <Link
                                href="/users/students"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Student'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
