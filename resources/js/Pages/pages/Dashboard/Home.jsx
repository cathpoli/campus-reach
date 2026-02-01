import AdminDashboard from "./Admin/AdminDashboard";

export default function Home({ totalTeachers, totalStudents, approvedAppointments }) {
	return (
		<AdminDashboard 
			totalTeachers={totalTeachers}
			totalStudents={totalStudents}
			approvedAppointments={approvedAppointments}
		/>
	);
}
