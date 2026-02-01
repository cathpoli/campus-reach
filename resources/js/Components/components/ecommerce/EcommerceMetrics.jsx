import {
	ArrowDownIcon,
	ArrowUpIcon,
	BoxIconLine,
	GroupIcon,
	UserCircleIcon,
	ClipboardListIcon,
} from "../../../Icons/icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics({ totalTeachers = 0, totalStudents = 0, approvedAppointments = 0 }) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
			{/* <!-- Teachers Metric --> */}
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
				<div className="flex items-center gap-4">
					<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 flex-shrink-0">
						<UserCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
					</div>
					<div className="flex-1">
						<h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
							{totalTeachers.toLocaleString()}
						</h4>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Total Teachers
						</span>
					</div>
				</div>
			</div>

			{/* <!-- Students Metric --> */}
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
				<div className="flex items-center gap-4">
					<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 flex-shrink-0">
						<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
					</div>
					<div className="flex-1">
						<h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
							{totalStudents.toLocaleString()}
						</h4>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Total Students
						</span>
					</div>
				</div>
			</div>

			{/* <!-- Approved Appointments Metric --> */}
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
				<div className="flex items-center gap-4">
					<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 flex-shrink-0">
						<ClipboardListIcon className="text-gray-800 size-6 dark:text-white/90" />
					</div>
					<div className="flex-1">
						<h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
							{approvedAppointments.toLocaleString()}
						</h4>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Approved Appointments
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
