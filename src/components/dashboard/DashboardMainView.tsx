import React from "react";
import { CityLocation, AirQualityReading } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { GuidanceResponse } from "@/types/guidance";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { AirQualityHero } from "@/components/AirQualityHero";
import { HealthAdvisoryBanner } from "@/components/HealthAdvisoryBanner";
import { ForecastChart } from "@/components/ForecastChart";
import { GuidanceSectionView } from "@/components/GuidanceSectionView";
import { AskFollowUpChat } from "@/components/AskFollowUpChat";
import { CompareCitiesView } from "@/components/CompareCitiesView";

interface DashboardMainViewProps {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  airQuality: AirQualityReading | null;
  guidance: GuidanceResponse | null;
  currentCity: CityLocation;
  profile: HouseholdProfile;
  onRefresh: () => void;
  onOpenShare: () => void;
  onRetry: () => void;
}

export const DashboardMainView: React.FC<DashboardMainViewProps> = ({
  isLoading,
  isRefreshing,
  error,
  airQuality,
  guidance,
  currentCity,
  profile,
  onRefresh,
  onOpenShare,
  onRetry,
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  if (!airQuality) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AirQualityHero
        reading={airQuality}
        selectedCityName={currentCity.name}
        onRefresh={onRefresh}
        onOpenShare={onOpenShare}
        isRefreshing={isRefreshing}
      />

      {guidance && <HealthAdvisoryBanner advisory={guidance.healthAdvisory} />}

      <ForecastChart
        forecast={airQuality.hourlyForecast}
        bestWindow={airQuality.bestWindow}
        avoidWindow={airQuality.avoidWindow}
      />

      {guidance && (
        <GuidanceSectionView
          guidance={guidance}
          aqi={airQuality.aqi}
          category={airQuality.cpcbCategory}
          profile={profile}
        />
      )}

      <AskFollowUpChat
        city={currentCity.name}
        aqi={airQuality.aqi}
        pm25={airQuality.pm25}
        pm10={airQuality.pm10}
        category={airQuality.cpcbCategory}
        profile={profile}
      />

      <CompareCitiesView />
    </div>
  );
};
