import type {
  Education,
  ProfileCompletion,
  ProfileFormValues,
  WorkExperience,
} from "@/types";

const REQUIRED_CHECKS: ReadonlyArray<{
  field: string;
  isFilled: (values: ProfileFormValues) => boolean;
}> = [
  { field: "full name", isFilled: (values) => hasText(values.fullName) },
  { field: "email", isFilled: (values) => hasText(values.email) },
  { field: "phone", isFilled: (values) => hasText(values.phone) },
  { field: "location", isFilled: (values) => hasText(values.location) },
  { field: "title", isFilled: (values) => hasText(values.currentTitle) },
  {
    field: "experience",
    isFilled: (values) => values.experienceLevel !== "",
  },
  {
    field: "years",
    isFilled: (values) => hasNonNegativeInteger(values.yearsExperience),
  },
  { field: "skills", isFilled: (values) => values.skills.length > 0 },
  {
    field: "work experience",
    isFilled: (values) => countFilledRoles(values.workExperience) > 0,
  },
  { field: "education", isFilled: (values) => isEducationFilled(values.education) },
  {
    field: "job titles",
    isFilled: (values) => splitCommaList(values.jobTitlesSeeking).length > 0,
  },
  {
    field: "remote",
    isFilled: (values) => values.remotePreference !== "",
  },
  {
    field: "authorization",
    isFilled: (values) => values.workAuthorization !== "",
  },
];

export function getProfileCompletion(
  values: ProfileFormValues,
): ProfileCompletion {
  const missingFields = REQUIRED_CHECKS.filter(
    (check) => !check.isFilled(values),
  ).map((check) => check.field);
  const filledCount = REQUIRED_CHECKS.length - missingFields.length;
  const percentage = Math.round((filledCount / REQUIRED_CHECKS.length) * 100);

  return {
    percentage,
    missingFields,
    isComplete: missingFields.length === 0,
  };
}

export function hasText(value: string): boolean {
  return value.trim().length > 0;
}

export function hasNonNegativeInteger(value: string): boolean {
  if (!hasText(value)) {
    return false;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0;
}

export function splitCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function countFilledRoles(roles: WorkExperience[]): number {
  return roles.filter(isFilledRole).length;
}

export function isFilledRole(role: WorkExperience): boolean {
  return hasText(role.company) && hasText(role.title);
}

export function isEducationFilled(education: Education): boolean {
  return (
    hasText(education.degree) ||
    hasText(education.field) ||
    hasText(education.institution) ||
    hasText(education.year)
  );
}

export function createEmptyWorkRole(): WorkExperience {
  return {
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    current: false,
    responsibilities: "",
  };
}

export function createEmptyEducation(): Education {
  return {
    degree: "",
    field: "",
    institution: "",
    year: "",
  };
}

export function createEmptyProfileFormValues(
  email: string,
  fullName: string,
): ProfileFormValues {
  return {
    fullName,
    email,
    phone: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
    workAuthorization: "",
    currentTitle: "",
    experienceLevel: "",
    yearsExperience: "",
    skills: [],
    industries: [],
    workExperience: [createEmptyWorkRole()],
    education: createEmptyEducation(),
    jobTitlesSeeking: "",
    remotePreference: "",
    salaryExpectation: "",
    preferredLocations: "",
    coverLetterTone: "",
    resumePdfUrl: null,
    resumePdfKey: null,
  };
}
