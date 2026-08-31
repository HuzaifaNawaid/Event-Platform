import { Button } from "@aws-platform/ui/components/button";
import {
	AlertCircle,
	CheckCircle2,
	FileText,
	Image as ImageIcon,
	Trash2,
	Upload,
} from "lucide-react";
import * as React from "react";

export interface PaymentProofUploadProps {
	fee?: number | null;
	accountNumber?: string;
	selectedFile: File | null;
	onFileSelect: (file: File | null) => void;
	error?: string;
	disabled?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const ACCEPTED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"application/pdf",
];

export default function PaymentProofUpload({
	fee,
	accountNumber = "0000-0000000-0",
	selectedFile,
	onFileSelect,
	error,
	disabled = false,
}: PaymentProofUploadProps) {
	const [internalError, setInternalError] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	const displayFee =
		fee === null || fee === undefined || fee === 0 ? "Free" : `Rs. ${fee}`;
	const isFree = fee === null || fee === undefined || fee === 0;

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInternalError(null);
		const file = e.target.files?.[0] || null;

		if (!file) {
			onFileSelect(null);
			return;
		}

		// Validate type
		if (!ACCEPTED_TYPES.includes(file.type)) {
			setInternalError(
				"Invalid file type. Please upload a JPEG, PNG, WEBP image or PDF.",
			);
			onFileSelect(null);
			return;
		}

		// Validate size
		if (file.size > MAX_FILE_SIZE_BYTES) {
			setInternalError("File is too large. Maximum allowed size is 5MB.");
			onFileSelect(null);
			return;
		}

		onFileSelect(file);
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation();
		setInternalError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		onFileSelect(null);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	return (
		<div className="space-y-4">
			{/* Payment Information Notice */}
			<div className="rounded-md border border-zinc-700 bg-zinc-800 p-4 text-sm text-zinc-300">
				<div className="mb-2 flex items-center justify-between border-zinc-700/60 border-b pb-2">
					<span className="font-medium text-zinc-200">Registration Fee:</span>
					<span className="font-semibold text-zinc-100">{displayFee}</span>
				</div>
				{!isFree ? (
					<div>
						<p className="mb-1 text-xs text-zinc-400">
							Please transfer{" "}
							<span className="font-medium text-zinc-200">{displayFee}</span> to
							the following account before submitting your application:
						</p>
						<div className="mt-2 flex items-center justify-between rounded border border-zinc-700/80 bg-zinc-900 px-3 py-2 font-mono text-[#FF9900] text-xs">
							<span>Account Number:</span>
							<span className="font-bold">{accountNumber}</span>
						</div>
					</div>
				) : (
					<p className="text-xs text-zinc-400">
						This event is free of charge. You may optionally attach an ID card
						or student verification screenshot below.
					</p>
				)}
			</div>

			{/* Upload Box */}
			<div>
				<label
					htmlFor="payment-proof-input"
					className="mb-2 block font-medium text-xs text-zinc-300"
				>
					Payment Proof Screenshot{" "}
					<span
						className={isFree ? "font-normal text-zinc-500" : "text-[#FF9900]"}
					>
						{isFree ? "(Optional)" : "*"}
					</span>
				</label>

				<input
					ref={fileInputRef}
					id="payment-proof-input"
					type="file"
					accept="image/*,application/pdf"
					disabled={disabled}
					onChange={handleFileChange}
					className="sr-only"
				/>

				{!selectedFile ? (
					<label
						htmlFor="payment-proof-input"
						className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-zinc-600 border-dashed bg-zinc-800/80 p-6 text-center transition-colors hover:border-zinc-400 hover:bg-zinc-800 ${
							disabled ? "cursor-not-allowed opacity-50" : ""
						}`}
					>
						<Upload className="mb-2 h-8 w-8 text-zinc-400" />
						<span className="font-medium text-sm text-zinc-200">
							Upload payment screenshot
						</span>
						<span className="mt-1 text-xs text-zinc-400">
							PNG, JPG, WEBP or PDF (max. 5MB)
						</span>
					</label>
				) : (
					<div className="flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 p-3">
						<div className="flex items-center gap-3 overflow-hidden">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-zinc-700 text-[#FF9900]">
								{selectedFile.type.startsWith("image/") ? (
									<ImageIcon className="h-5 w-5" />
								) : (
									<FileText className="h-5 w-5" />
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-sm text-zinc-100">
									{selectedFile.name}
								</p>
								<p className="text-xs text-zinc-400">
									{formatFileSize(selectedFile.size)}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2 pl-2">
							<span className="flex items-center gap-1 text-emerald-400 text-xs">
								<CheckCircle2 className="h-4 w-4" />
								<span className="hidden sm:inline">Ready</span>
							</span>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleRemove}
								disabled={disabled}
								className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-700/50 hover:text-red-400"
							>
								<Trash2 className="h-4 w-4" />
								<span className="sr-only">Remove file</span>
							</Button>
						</div>
					</div>
				)}

				{/* Errors */}
				{(internalError || error) && (
					<div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
						<AlertCircle className="h-3.5 w-3.5 shrink-0" />
						<span>{internalError || error}</span>
					</div>
				)}
			</div>
		</div>
	);
}
