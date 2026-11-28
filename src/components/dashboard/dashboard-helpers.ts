import { CpcbCategory } from "@/types/air-quality";

export function getCategoryBackgroundClass(category?: CpcbCategory): string {
  if (!category) return "bg-slate-50 dark:bg-slate-950";
  switch (category) {
    case "Severe":
      return "bg-gradient-to-b from-purple-50/40 via-slate-50 to-slate-50 dark:from-purple-950/20 dark:via-slate-950 dark:to-slate-950";
    case "Very Poor":
      return "bg-gradient-to-b from-rose-50/40 via-slate-50 to-slate-50 dark:from-rose-950/20 dark:via-slate-950 dark:to-slate-950";
    case "Poor":
      return "bg-gradient-to-b from-orange-50/40 via-slate-50 to-slate-50 dark:from-orange-950/20 dark:via-slate-950 dark:to-slate-950";
    case "Moderate":
      return "bg-gradient-to-b from-amber-50/30 via-slate-50 to-slate-50 dark:from-amber-950/15 dark:via-slate-950 dark:to-slate-950";
    case "Satisfactory":
    case "Good":
    default:
      return "bg-gradient-to-b from-emerald-50/30 via-slate-50 to-slate-50 dark:from-emerald-950/15 dark:via-slate-950 dark:to-slate-950";
  }
}
