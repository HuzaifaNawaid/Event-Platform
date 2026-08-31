import { Button } from "@aws-platform/ui/components/button";
import { Card } from "@aws-platform/ui/components/card";
import { Input } from "@aws-platform/ui/components/input";
import { Label } from "@aws-platform/ui/components/label";
import { Select } from "@aws-platform/ui/components/select";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import PaymentProofUpload from "./payment-proof-upload";

export interface RegistrationFormEvent {
	id: string;
	title: string;
	fee?: number | null;
	accountNumber?: string;
	status?: string;
}

export interface RegistrationFormProps {
	event: RegistrationFormEvent;
	user?: {
		id?: string;
		name?: string | null;
		email?: string | null;
	} | null;
	onSuccessRedirect?: string;
}

export interface ApplicationFormData {
	fullName: string;
	email: string;
	university: string;
	yearOfStudy: string;
	phoneNumber: string;
	paymentScreenshotFile: File | null;
	customFields?: Record<string, string>;
}

export default function RegistrationForm({
	event,
	user,
	onSuccessRedirect = "/dashboard",
}: RegistrationFormProps) {
	const navigate = useNavigate();

	const [formData, setFormData] = React.useState<ApplicationFormData>({
		fullName: user?.name || "",
		email: user?.email || "",
		university: "",
		yearOfStudy: "1st Year",
		phoneNumber: "",
		paymentScreenshotFile: null,
	});

	const [errors, setErrors] = React.useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [submissionError, setSubmissionError] = React.useState<string | null>(
		null,
	);
	const [isSuccess, setIsSuccess] = React.useState(false);

	// Update prefill if user logs in or session resolves
	React.useEffect(() => {
		if (user) {
			setFormData((prev) => ({
				...prev,
				fullName: prev.fullName || user.name || "",
				email: prev.email || user.email || "",
			}));
		}
	}, [user]);

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email address is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.university.trim()) {
			newErrors.university = "University / Institution is required";
		}

		if (!formData.phoneNumber.trim()) {
			newErrors.phoneNumber = "Phone number is required";
		} else if (!/^[0-9+\s-]{7,18}$/.test(formData.phoneNumber.trim())) {
			newErrors.phoneNumber = "Please enter a valid phone number";
		}

		const isFree =
			event.fee === null || event.fee === undefined || event.fee === 0;
		if (!isFree && !formData.paymentScreenshotFile) {
			newErrors.paymentScreenshot =
				"Payment proof screenshot is required for paid events";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (field: keyof ApplicationFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	};

	const handleFileSelect = (file: File | null) => {
		setFormData((prev) => ({ ...prev, paymentScreenshotFile: file }));
		if (errors.paymentScreenshot) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next.paymentScreenshot;
				return next;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmissionError(null);

		if (!validate()) {
			toast.error("Please fill in all required fields correctly.");
			return;
		}

		setIsSubmitting(true);

		try {
			// TODO: [BACKEND - Waleed / R2 Storage] — upload payment screenshot file to R2 via signed URL or upload endpoint
			// const paymentScreenshotUrl = await uploadToStorage(formData.paymentScreenshotFile);
			const placeholderPaymentUrl = formData.paymentScreenshotFile
				? `https://storage.aws-platform.internal/proofs/${event.id}/${formData.paymentScreenshotFile.name}`
				: "free-event-no-proof";

			// TODO: [BACKEND - Waleed] — call trpc.applications.create.mutate({
			//   eventId: event.id,
			//   university: formData.university,
			//   formData: {
			//     fullName: formData.fullName,
			//     email: formData.email,
			//     phoneNumber: formData.phoneNumber,
			//     yearOfStudy: formData.yearOfStudy,
			//   },
			//   paymentScreenshotUrl: placeholderPaymentUrl
			// })
			// Simulated payload structure matching Prisma Application model contract
			const applicationPayload = {
				eventId: event.id,
				university: formData.university,
				formData: {
					fullName: formData.fullName,
					email: formData.email,
					phoneNumber: formData.phoneNumber,
					yearOfStudy: formData.yearOfStudy,
				},
				paymentScreenshotUrl: placeholderPaymentUrl,
			};

			console.log("[Application Submitted]", applicationPayload);

			// Brief delay for UX transition
			await new Promise((resolve) => setTimeout(resolve, 600));

			setIsSuccess(true);
			toast.success("Application submitted successfully!");

			// Navigate to user dashboard
			setTimeout(() => {
				navigate(onSuccessRedirect);
			}, 1000);
		} catch (err: unknown) {
			const errorMsg =
				err instanceof Error
					? err.message
					: "Failed to submit application. Please try again.";
			setSubmissionError(errorMsg);
			toast.error(errorMsg);
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<Card className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-8 text-center">
				<CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-400" />
				<h3 className="font-bold text-xl text-zinc-100">
					Application Submitted!
				</h3>
				<p className="mt-2 text-sm text-zinc-400">
					Your registration for{" "}
					<span className="font-semibold text-zinc-200">{event.title}</span> has
					been received. Redirecting to your dashboard...
				</p>
			</Card>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6" noValidate>
			{submissionError && (
				<div className="flex items-center gap-2 rounded-md border border-red-900/50 bg-red-950/30 p-3.5 text-red-400 text-sm">
					<AlertCircle className="h-4 w-4 shrink-0" />
					<span>{submissionError}</span>
				</div>
			)}

			{/* Personal Info Section */}
			<div className="space-y-4">
				<h4 className="font-semibold text-sm text-zinc-200 uppercase tracking-wider">
					Personal Information
				</h4>

				{/* Full Name */}
				<div className="space-y-1.5">
					<Label
						htmlFor="fullName"
						className="font-medium text-xs text-zinc-300"
					>
						Full Name <span className="text-[#FF9900]">*</span>
					</Label>
					<Input
						id="fullName"
						type="text"
						placeholder="e.g. Alex Johnson"
						value={formData.fullName}
						onChange={(e) => handleChange("fullName", e.target.value)}
						disabled={isSubmitting}
						className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#FF9900]"
					/>
					{errors.fullName && (
						<p className="text-red-400 text-xs">{errors.fullName}</p>
					)}
				</div>

				{/* Email Address */}
				<div className="space-y-1.5">
					<Label htmlFor="email" className="font-medium text-xs text-zinc-300">
						Email Address <span className="text-[#FF9900]">*</span>
					</Label>
					<Input
						id="email"
						type="email"
						placeholder="alex@university.edu"
						value={formData.email}
						onChange={(e) => handleChange("email", e.target.value)}
						disabled={isSubmitting}
						className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#FF9900]"
					/>
					{errors.email && (
						<p className="text-red-400 text-xs">{errors.email}</p>
					)}
				</div>

				{/* Phone Number */}
				<div className="space-y-1.5">
					<Label
						htmlFor="phoneNumber"
						className="font-medium text-xs text-zinc-300"
					>
						Phone Number <span className="text-[#FF9900]">*</span>
					</Label>
					<Input
						id="phoneNumber"
						type="tel"
						placeholder="+92 300 1234567"
						value={formData.phoneNumber}
						onChange={(e) => handleChange("phoneNumber", e.target.value)}
						disabled={isSubmitting}
						className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#FF9900]"
					/>
					{errors.phoneNumber && (
						<p className="text-red-400 text-xs">{errors.phoneNumber}</p>
					)}
				</div>
			</div>

			{/* Academic Info Section */}
			<div className="space-y-4 border-zinc-800 border-t pt-4">
				<h4 className="font-semibold text-sm text-zinc-200 uppercase tracking-wider">
					Academic Information
				</h4>

				{/* University / Institution */}
				<div className="space-y-1.5">
					<Label
						htmlFor="university"
						className="font-medium text-xs text-zinc-300"
					>
						University / Institution <span className="text-[#FF9900]">*</span>
					</Label>
					<Input
						id="university"
						type="text"
						placeholder="e.g. FAST NUCES / NUST / GIKI"
						value={formData.university}
						onChange={(e) => handleChange("university", e.target.value)}
						disabled={isSubmitting}
						className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#FF9900]"
					/>
					{errors.university && (
						<p className="text-red-400 text-xs">{errors.university}</p>
					)}
				</div>

				{/* Year of Study */}
				<div className="space-y-1.5">
					<Label
						htmlFor="yearOfStudy"
						className="font-medium text-xs text-zinc-300"
					>
						Year of Study <span className="text-[#FF9900]">*</span>
					</Label>
					<Select
						id="yearOfStudy"
						value={formData.yearOfStudy}
						onChange={(e) => handleChange("yearOfStudy", e.target.value)}
						disabled={isSubmitting}
					>
						<option value="1st Year">1st Year (Freshman)</option>
						<option value="2nd Year">2nd Year (Sophomore)</option>
						<option value="3rd Year">3rd Year (Junior)</option>
						<option value="4th Year">4th Year (Senior)</option>
						<option value="Postgraduate">Postgraduate / Masters</option>
						<option value="Other">Other / Graduate</option>
					</Select>
				</div>
			</div>

			{/* Payment Section */}
			<div className="space-y-4 border-zinc-800 border-t pt-4">
				<h4 className="font-semibold text-sm text-zinc-200 uppercase tracking-wider">
					Payment Verification
				</h4>

				<PaymentProofUpload
					fee={event.fee}
					accountNumber={event.accountNumber}
					selectedFile={formData.paymentScreenshotFile}
					onFileSelect={handleFileSelect}
					error={errors.paymentScreenshot}
					disabled={isSubmitting}
				/>
			</div>

			{/* Submit Action */}
			<div className="pt-4">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="h-11 w-full cursor-pointer rounded-md bg-[#FF9900] font-semibold text-black text-sm shadow-none transition-colors hover:bg-[#cc7a00] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? (
						<span className="flex items-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							Submitting Application...
						</span>
					) : (
						"Submit Application"
					)}
				</Button>
			</div>
		</form>
	);
}
