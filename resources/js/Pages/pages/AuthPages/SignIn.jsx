import PageMeta from "../../../Components/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../../Components/components/auth/SignInForm";

export default function SignIn() {
	return (
		<>
			<PageMeta
				title="Admin Login - CampusReach"
				description="Admin login page for CampusReach"
			/>
			<AuthLayout>
				<SignInForm />
			</AuthLayout>
		</>
	);
}