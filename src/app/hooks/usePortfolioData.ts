"use client";

import type { PortfolioData } from "../types/portfolio-data.type";
import { useJsonData } from "./useJsonData";

/**
 * Fetches the portfolio JSON.
 *
 * Production URL is taken from NEXT_PUBLIC_PORTFOLIO_DATA_URL.
 * Development fallback is /archived/data.json.
 */
export function usePortfolioData() {
  return useJsonData<PortfolioData>({
    devUrl: "/archived/data.json",
    prodUrl: process.env.NEXT_PUBLIC_PORTFOLIO_DATA_URL,
  });
}
