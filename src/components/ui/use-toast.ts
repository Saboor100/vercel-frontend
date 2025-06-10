
// This file serves as a compatibility layer to redirect imports from "@/components/ui/use-toast"
// to the actual implementation in "@/hooks/use-toast"

import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };
