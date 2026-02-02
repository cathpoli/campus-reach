import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../../Icons/icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);
	
	const { data, setData, post, processing, errors } = useForm({
		email: '',
		password: '',
		remember: false,
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		post('/');
	};

	return (
		<div className="flex flex-col flex-1">
			<div className="w-full max-w-md pt-10 mx-auto">
			</div>
			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div>
					<div className="mb-5 sm:mb-8">
						<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
							Sign In
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Enter your email and password to sign in!
						</p>
					</div>
					<div>
						<form onSubmit={handleSubmit}>
							<div className="space-y-6">
								<div>
									<Label>
										Email <span className="text-error-500">*</span>{" "}
									</Label>
									<Input 
										placeholder="info@gmail.com" 
										value={data.email}
										onChange={(e) => setData('email', e.target.value)}
										required
									/>
									{errors.email && <div className="mt-1 text-sm text-error-500">{errors.email}</div>}
								</div>
								<div>
									<Label>
										Password <span className="text-error-500">*</span>{" "}
									</Label>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											value={data.password}
											onChange={(e) => setData('password', e.target.value)}
											required
										/>
										<span
											onClick={() => setShowPassword(!showPassword)}
											className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
										>
											{showPassword ? (
												<EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
											) : (
												<EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
											)}
										</span>
									</div>
									{errors.password && <div className="mt-1 text-sm text-error-500">{errors.password}</div>}
								</div>
								{/* <div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Checkbox 
											checked={data.remember} 
											onChange={(checked) => setData('remember', checked)} 
										/>
										<span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
											Keep me logged in
										</span>
									</div>
									<Link
										to="/reset-password"
										className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
									>
										Forgot password?
									</Link>
								</div> */}
								<div>
									<Button type="submit" className="w-full" size="sm" disabled={processing}>
										{processing ? 'Signing in...' : 'Sign in'}
									</Button>
								</div>
								<div className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 p-4 border rounded-lg text-sm justify-items-center" role="alert">
                                    <p><b>Demo Account for teacher</b></p>
									<p>Email: m.chen@school.edu</p>
									<p>Password: password123</p>

									<br />

									<p><b>Demo Account for student</b></p>
									<p>Email: j.reyes@school.edu</p>
									<p>Password: password123</p>
                                </div>
							</div>
						</form>

						<div className="mt-5">
							{/* <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
								Don&apos;t have an account? {""}
								<Link
									to="/signup"
									className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
								>
									Sign Up
								</Link>
							</p> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
