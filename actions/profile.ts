"use server";

import { revalidatePath } from "next/cache";
import {
  createInsforgeServer,
  getCurrentUser,
} from "@/lib/insforge-server";
import { capturePostHogServerEvent } from "@/lib/posthog-server";
import {
  getCoverLetterTones,
  getExperienceLevels,
  getRemotePreferences,
  getWorkAuthorizations,
  parseOptionalEnum,
  parseProfileRecord,
  parseYearsExperience,
  PROFILE_SELECT_COLUMNS,
  serializeEducation,
  serializeWorkExperience,
} from "@/lib/profile-mappers";
import { hasText, splitCommaList } from "@/lib/profile-completion";
import type { ProfileSaveInput, ProfileSaveResult } from "@/types";

export async function saveProfile(
  input: ProfileSaveInput,
): Promise<ProfileSaveResult> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: "Please sign in to save your profile." };
    }

    const years = parseYearsExperience(input.yearsExperience);

    if (!years.ok) {
      return {
        success: false,
        error: "Years of experience must be a whole number of 0 or more.",
      };
    }

    const experienceLevel = parseOptionalEnum(
      input.experienceLevel,
      getExperienceLevels(),
    );
    const remotePreference = parseOptionalEnum(
      input.remotePreference,
      getRemotePreferences(),
    );
    const workAuthorization = parseOptionalEnum(
      input.workAuthorization,
      getWorkAuthorizations(),
    );
    const coverLetterTone = parseOptionalEnum(
      input.coverLetterTone,
      getCoverLetterTones(),
    );

    if (input.experienceLevel && experienceLevel === null) {
      return { success: false, error: "Choose a valid experience level." };
    }

    if (input.remotePreference && remotePreference === null) {
      return { success: false, error: "Choose a valid remote preference." };
    }

    if (input.workAuthorization && workAuthorization === null) {
      return { success: false, error: "Choose a valid work authorization." };
    }

    if (input.coverLetterTone && coverLetterTone === null) {
      return { success: false, error: "Choose a valid cover letter tone." };
    }

    const workExperience = serializeWorkExperience(input.workExperience);

    if (workExperience.length > 3) {
      return {
        success: false,
        error: "You can save up to three work experience roles.",
      };
    }

    const insforge = await createInsforgeServer();
    const { data: existingRow, error: existingError } = await insforge.database
      .from("profiles")
      .select("id, is_complete")
      .eq("id", user.id)
      .maybeSingle();

    if (existingError) {
      console.error("[actions/profile]", existingError);
      return { success: false, error: "Could not load your profile." };
    }

    const existing = parseProfileRecord(existingRow);

    const payload = {
      full_name: emptyToNull(input.fullName),
      phone: emptyToNull(input.phone),
      location: emptyToNull(input.location),
      current_title: emptyToNull(input.currentTitle),
      experience_level: experienceLevel,
      years_experience: years.value,
      skills: input.skills.map((skill) => skill.trim()).filter(hasText),
      industries: input.industries.map((item) => item.trim()).filter(hasText),
      work_experience: workExperience,
      education: serializeEducation(input.education),
      job_titles_seeking: splitCommaList(input.jobTitlesSeeking),
      remote_preference: remotePreference,
      preferred_locations: splitCommaList(input.preferredLocations),
      salary_expectation: emptyToNull(input.salaryExpectation),
      cover_letter_tone: coverLetterTone,
      linkedin_url: emptyToNull(input.linkedinUrl),
      portfolio_url: emptyToNull(input.portfolioUrl),
      work_authorization: workAuthorization,
    };

    const resumeFields =
      input.resumePdfUrl && input.resumePdfKey
        ? {
            resume_pdf_url: input.resumePdfUrl,
            resume_pdf_key: input.resumePdfKey,
          }
        : {};

    if (existing) {
      const { error: updateError } = await insforge.database
        .from("profiles")
        .update({
          ...payload,
          ...resumeFields,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("[actions/profile]", updateError);
        return { success: false, error: "Could not save your profile." };
      }
    } else {
      const { error: insertError } = await insforge.database
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: user.email,
            ...payload,
            ...resumeFields,
          },
        ]);

      if (insertError) {
        console.error("[actions/profile]", insertError);
        return { success: false, error: "Could not save your profile." };
      }
    }

    const { data: savedRow, error: savedError } = await insforge.database
      .from("profiles")
      .select(PROFILE_SELECT_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    if (savedError) {
      console.error("[actions/profile]", savedError);
      revalidatePath("/profile");
      return { success: true, isComplete: false };
    }

    const saved = parseProfileRecord(savedRow);
    const wasComplete = existing?.is_complete === true;
    const isComplete = saved?.is_complete === true;

    if (!wasComplete && isComplete) {
      await capturePostHogServerEvent(user.id, "profile_completed", {
        userId: user.id,
      });
    }

    revalidatePath("/profile");
    return { success: true, isComplete };
  } catch (error) {
    console.error("[actions/profile]", error);
    return { success: false, error: "Could not save your profile." };
  }
}

function emptyToNull(value: string): string | null {
  return hasText(value) ? value.trim() : null;
}
