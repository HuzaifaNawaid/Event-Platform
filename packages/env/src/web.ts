import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const meta = (import.meta as any).env ?? {};

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_SERVER_URL: z.string().url(),
	},
	runtimeEnv: {
		VITE_SERVER_URL:
			meta.VITE_SERVER_URL || "http://localhost:3000",
	},
	skipValidation: !!meta.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
