import EcommerceMetrics from "../../../../Components/components/ecommerce/EcommerceMetrics";
import PageMeta from "../../../../Components/components/common/PageMeta";
import AppLayout from "../../../../Layouts/layout/AppLayout";

export default function AdminDashboard({ totalTeachers, totalStudents, approvedAppointments }) {
	return (
		<AppLayout>
			<PageMeta
				title="Admin Dashboard - Campus Reach"
				description="Campus Reach Admin Dashboard"
			/>
			<div className="grid grid-cols-12 gap-4 md:gap-6">
				<div className="col-span-12">
					<EcommerceMetrics 
						totalTeachers={totalTeachers}
						totalStudents={totalStudents}
						approvedAppointments={approvedAppointments}
					/>
				</div>
			</div>
		</AppLayout>
	);
}
