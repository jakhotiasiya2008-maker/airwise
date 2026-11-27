"use client";

import React, { useState } from "react";
import { HouseholdProfile, CommuteMode } from "@/types/profile";
import { X, Check } from "lucide-react";
import { DemographicCheckboxes } from "./profile/DemographicCheckboxes";
import { ApplianceCheckboxes } from "./profile/ApplianceCheckboxes";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HouseholdProfile;
  onSaveProfile: (profile: HouseholdProfile) => void;
}

/**
 * Modal dialog for configuring household vulnerability attributes,
 * commute modes, air purifier ownership, and medical notes.
 */
export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<HouseholdProfile>({ ...profile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 id="profile-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Household Vulnerability Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stored locally on your device. We use this to personalize smog safety actions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close profile configuration"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Household Demographic Checkboxes */}
          <DemographicCheckboxes profile={formData} onChange={setFormData} />

          {/* Commute Mode Selector */}
          <div>
            <label
              htmlFor="commute-mode-select"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Primary Daily Commute Mode
            </label>
            <select
              id="commute-mode-select"
              value={formData.commuteMode}
              onChange={(e) => setFormData({ ...formData, commuteMode: e.target.value as CommuteMode })}
              className="w-full py-2 px-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="metro">Metro Rail (Protected subterranean/cabin)</option>
              <option value="bike">Motorcycle / Scooter (Direct exposure)</option>
              <option value="bus">Public Bus / Shared Cab</option>
              <option value="car">Personal Car (Enclosed HVAC)</option>
              <option value="walk">Walking / Bicycle</option>
              <option value="auto_rickshaw">Auto-Rickshaw</option>
              <option value="wfh">Work from Home / Remote</option>
            </select>
          </div>

          {/* Equipment & Indoor Setup */}
          <ApplianceCheckboxes profile={formData} onChange={setFormData} />

          {/* Custom Notes (Sanitized) */}
          <div>
            <label
              htmlFor="custom-notes"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Specific Sensitivities or Context (Max 300 chars)
            </label>
            <textarea
              id="custom-notes"
              rows={2}
              maxLength={300}
              value={formData.customNotes || ""}
              onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
              placeholder="e.g. Toddler with allergic rhinitis; live near construction zone..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              Save Profile & Update Advice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
