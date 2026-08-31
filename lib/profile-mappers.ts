import type {
  CoverLetterTone,
  Education,
  ExperienceLevel,
  ProfileFormValues,
  ProfileRecord,
  RemotePreference,
  WorkAuthorization,
  WorkExperience,
} from "@/types";
import {
  createEmptyEducation,
  createEmptyProfileFormValues,
  createEmptyWorkRole,
  hasNonNegativeInteger,
  hasText,
  isEducationFilled,
  isFilledRole,
} from "@/lib/profile-completion";

export const PROFILE_SELECT_COLUMNS =
  "id, full_name, email, phone, location, current_title, experience_level, years_experience, skills, industries, work_experience, education, job_titles_seeking, remote_preference, preferred_locations, salary_expectation, cover_letter_tone, linkedin_url, portfolio_url, work_authorization, resume_pdf_url, resume_pdf_key, is_complete";

const EXPERIENCE_LEVELS: readonly ExperienceLevel[] = [
  "junior",
  "mid",
  "senior",
  "lead",
];
const REMOTE_PREFERENCES: readonly RemotePreference[] = [
  "remote",
  "onsite",
  "hybrid",
  "any",
];
const WORK_AUTHORIZATIONS: readonly WorkAuthorization[] = [
  "citizen",
  "permanent_resident",
  "visa_required",
];
const COVER_LETTER_TONES: readonly CoverLetterTone[] = [
  "formal",
  "casual",
  "enthusiastic",
];

export function profileRecordToFormValues(
  record: ProfileRecord | null,
  email: string,
  fallbackName: string,
): ProfileFormValues {
  if (!record) {
    return createEmptyProfileFormValues(email, fallbackName);
  }

  const education = parseEducation(record.education);
  const workExperience = parseWorkExperience(record.work_experience);

  return {
    fullName: record.full_name ?? fallbackName,
    email: record.email ?? email,
    phone: record.phone ?? "",
    location: record.location ?? "",
    linkedinUrl: record.linkedin_url ?? "",
    portfolioUrl: record.portfolio_url ?? "",
    workAuthorization: record.work_authorization ?? "",
    currentTitle: record.current_title ?? "",
    experienceLevel: record.experience_level ?? "",
    yearsExperience:
      record.years_experience === null ? "" : String(record.years_experience),
    skills: record.skills ?? [],
    industries: record.industries ?? [],
    workExperience:
      workExperience.length > 0 ? workExperience : [createEmptyWorkRole()],
    education,
    jobTitlesSeeking: (record.job_titles_seeking ?? []).join(", "),
    remotePreference: record.remote_preference ?? "",
    salaryExpectation: record.salary_expectation ?? "",
    preferredLocations: (record.preferred_locations ?? []).join(", "),
    coverLetterTone: record.cover_letter_tone ?? "",
    resumePdfUrl: record.resume_pdf_url,
    resumePdfKey: record.resume_pdf_key,
  };
}

export function parseProfileRecord(value: unknown): ProfileRecord | null {
  if (!isRecord(value) || typeof value.id !== "string") {
    return null;
  }

  const experienceLevel = parseStoredEnum(value.experience_level, EXPERIENCE_LEVELS);
  const remotePreference = parseStoredEnum(
    value.remote_preference,
    REMOTE_PREFERENCES,
  );
  const workAuthorization = parseStoredEnum(
    value.work_authorization,
    WORK_AUTHORIZATIONS,
  );
  const coverLetterTone = parseStoredEnum(
    value.cover_letter_tone,
    COVER_LETTER_TONES,
  );

  return {
    id: value.id,
    full_name: readNullableString(value.full_name),
    email: readNullableString(value.email),
    phone: readNullableString(value.phone),
    location: readNullableString(value.location),
    current_title: readNullableString(value.current_title),
    experience_level: experienceLevel,
    years_experience:
      typeof value.years_experience === "number" ? value.years_experience : null,
    skills: readStringArray(value.skills),
    industries: readStringArray(value.industries),
    work_experience: parseWorkExperience(value.work_experience),
    education: parseEducation(value.education),
    job_titles_seeking: readStringArray(value.job_titles_seeking),
    remote_preference: remotePreference,
    preferred_locations: readStringArray(value.preferred_locations),
    salary_expectation: readNullableString(value.salary_expectation),
    cover_letter_tone: coverLetterTone,
    linkedin_url: readNullableString(value.linkedin_url),
    portfolio_url: readNullableString(value.portfolio_url),
    work_authorization: workAuthorization,
    resume_pdf_url: readNullableString(value.resume_pdf_url),
    resume_pdf_key: readNullableString(value.resume_pdf_key),
    is_complete: value.is_complete === true,
  };
}

export function parseOptionalEnum<T extends string>(
  value: string,
  allowed: readonly T[],
): T | null {
  if (!hasText(value)) {
    return null;
  }

  return allowed.find((item) => item === value) ?? null;
}

export function getExperienceLevels(): readonly ExperienceLevel[] {
  return EXPERIENCE_LEVELS;
}

export function getRemotePreferences(): readonly RemotePreference[] {
  return REMOTE_PREFERENCES;
}

export function getWorkAuthorizations(): readonly WorkAuthorization[] {
  return WORK_AUTHORIZATIONS;
}

export function getCoverLetterTones(): readonly CoverLetterTone[] {
  return COVER_LETTER_TONES;
}

export function parseYearsExperience(
  value: string,
): { ok: true; value: number | null } | { ok: false } {
  if (!hasText(value)) {
    return { ok: true, value: null };
  }

  if (!hasNonNegativeInteger(value)) {
    return { ok: false };
  }

  return { ok: true, value: Number(value) };
}

export function serializeEducation(
  education: Education,
): Education | Record<string, never> {
  if (!isEducationFilled(education)) {
    return {};
  }

  return {
    degree: education.degree.trim(),
    field: education.field.trim(),
    institution: education.institution.trim(),
    year: education.year.trim(),
  };
}

export function serializeWorkExperience(
  roles: WorkExperience[],
): WorkExperience[] {
  return roles.filter(isFilledRole).slice(0, 3).map((role) => ({
    company: role.company.trim(),
    title: role.title.trim(),
    startDate: role.startDate.trim(),
    endDate: role.current ? "" : role.endDate.trim(),
    current: role.current,
    responsibilities: role.responsibilities.trim(),
  }));
}

function parseEducation(value: unknown): Education {
  if (!isRecord(value)) {
    return createEmptyEducation();
  }

  return {
    degree: readString(value.degree),
    field: readString(value.field),
    institution: readString(value.institution),
    year: readString(value.year),
  };
}

function parseWorkExperience(value: unknown): WorkExperience[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (!isRecord(item)) {
      return createEmptyWorkRole();
    }

    return {
      company: readString(item.company),
      title: readString(item.title),
      startDate: readString(item.startDate),
      endDate: readString(item.endDate),
      current: item.current === true,
      responsibilities: readString(item.responsibilities),
    };
  });
}

function parseStoredEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | null {
  if (typeof value !== "string") {
    return null;
  }

  return allowed.find((item) => item === value) ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readNullableString(value: unknown): string | null {
  return typeof value === "string" && hasText(value) ? value : null;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}
