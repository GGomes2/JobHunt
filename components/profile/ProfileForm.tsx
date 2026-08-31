"use client";

import type { ChangeEvent, FormEvent, ReactElement } from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { createEmptyWorkRole } from "@/lib/profile-completion";
import type { ProfileFormValues } from "@/types";

const MAX_WORK_ROLES = 3;

const inputClassName =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium leading-5 text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent";

const labelClassName =
  "text-xs font-medium uppercase leading-4 tracking-[0.02em] text-text-secondary";

const sectionHeadingClassName =
  "text-sm font-semibold leading-5 text-text-primary";

const secondaryButtonClassName =
  "mt-1 inline-flex items-center rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium leading-5 text-text-primary hover:bg-surface-secondary";

type ProfileFormProps = {
  values: ProfileFormValues;
  isSaving: boolean;
  statusMessage: string | null;
  statusTone: "error" | "success";
  onChange: (patch: Partial<ProfileFormValues>) => void;
  onSave: () => Promise<void>;
};

export function ProfileForm({
  values,
  isSaving,
  statusMessage,
  statusTone,
  onChange,
  onSave,
}: ProfileFormProps): ReactElement {
  const [skillDraft, setSkillDraft] = useState("");
  const [industryDraft, setIndustryDraft] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await onSave();
  };

  const addSkill = (): void => {
    const skill = skillDraft.trim();

    if (!skill || values.skills.includes(skill)) {
      setSkillDraft("");
      return;
    }

    onChange({ skills: [...values.skills, skill] });
    setSkillDraft("");
  };

  const addIndustry = (): void => {
    const industry = industryDraft.trim();

    if (!industry || values.industries.includes(industry)) {
      setIndustryDraft("");
      return;
    }

    onChange({ industries: [...values.industries, industry] });
    setIndustryDraft("");
  };

  const updateRole = (
    index: number,
    patch: Partial<ProfileFormValues["workExperience"][number]>,
  ): void => {
    onChange({
      workExperience: values.workExperience.map((role, roleIndex) =>
        roleIndex === index ? { ...role, ...patch } : role,
      ),
    });
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div>
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Profile Information
        </h2>
        <p className="mt-1 text-xs font-normal leading-4 text-text-muted">
          This profile is used to personalize opportunities and resume
          documents.
        </p>
      </div>

      <form className="mt-6 border-t border-border pt-6" onSubmit={handleSubmit}>
        <div>
          <h3 className={sectionHeadingClassName}>Personal Info</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label>
              <span className={labelClassName}>Full Name</span>
              <input
                className={inputClassName}
                value={values.fullName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ fullName: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Email</span>
              <input
                className={`${inputClassName} bg-surface-secondary text-text-secondary`}
                value={values.email}
                readOnly
              />
            </label>
            <label>
              <span className={labelClassName}>Phone Number</span>
              <input
                className={inputClassName}
                placeholder="+1 (555) 000-0000"
                value={values.phone}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ phone: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Location</span>
              <input
                className={inputClassName}
                placeholder="City, Country"
                value={values.location}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ location: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>LinkedIn URL</span>
              <input
                className={inputClassName}
                value={values.linkedinUrl}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ linkedinUrl: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Portfolio / GitHub</span>
              <input
                className={inputClassName}
                value={values.portfolioUrl}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ portfolioUrl: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Work Authorization</span>
              <select
                className={inputClassName}
                value={values.workAuthorization}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  onChange({
                    workAuthorization:
                      event.target.value === ""
                        ? ""
                        : event.target.value === "citizen" ||
                            event.target.value === "permanent_resident" ||
                            event.target.value === "visa_required"
                          ? event.target.value
                          : "",
                  });
                }}
              >
                <option value="">Select</option>
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="visa_required">Visa Required</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-10">
          <h3 className={sectionHeadingClassName}>Professional Info</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className={labelClassName}>Current/Most Recent Job Title</span>
              <input
                className={inputClassName}
                value={values.currentTitle}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ currentTitle: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Experience Level</span>
              <select
                className={inputClassName}
                value={values.experienceLevel}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  const next = event.target.value;
                  onChange({
                    experienceLevel:
                      next === "junior" ||
                      next === "mid" ||
                      next === "senior" ||
                      next === "lead"
                        ? next
                        : "",
                  });
                }}
              >
                <option value="">Select</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </label>
            <label>
              <span className={labelClassName}>Years of Experience</span>
              <input
                className={inputClassName}
                inputMode="numeric"
                value={values.yearsExperience}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ yearsExperience: event.target.value });
                }}
              />
            </label>
          </div>

          <div className="mt-4">
            <span className={labelClassName}>Skills</span>
            <div className="mt-1 flex gap-2">
              <input
                className={inputClassName}
                placeholder="Add a skill"
                aria-label="Add a skill"
                value={skillDraft}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSkillDraft(event.target.value);
                }}
              />
              <button
                type="button"
                className={secondaryButtonClassName}
                onClick={addSkill}
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {values.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium leading-4 text-text-secondary"
                  onClick={() => {
                    onChange({
                      skills: values.skills.filter((item) => item !== skill),
                    });
                  }}
                >
                  {skill} ×
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <span className={labelClassName}>Industries Worked In (Optional)</span>
            <div className="mt-1 flex gap-2">
              <input
                className={inputClassName}
                placeholder="e.g. FinTech, Healthcare"
                aria-label="Industries worked in"
                value={industryDraft}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setIndustryDraft(event.target.value);
                }}
              />
              <button
                type="button"
                className={secondaryButtonClassName}
                onClick={addIndustry}
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {values.industries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium leading-4 text-text-secondary"
                  onClick={() => {
                    onChange({
                      industries: values.industries.filter(
                        (item) => item !== industry,
                      ),
                    });
                  }}
                >
                  {industry} ×
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className={sectionHeadingClassName}>Work Experience</h3>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium leading-5 text-accent hover:text-accent-dark disabled:text-text-muted"
              disabled={values.workExperience.length >= MAX_WORK_ROLES}
              onClick={() => {
                if (values.workExperience.length >= MAX_WORK_ROLES) {
                  return;
                }

                onChange({
                  workExperience: [
                    ...values.workExperience,
                    createEmptyWorkRole(),
                  ],
                });
              }}
            >
              <Plus className="size-4" aria-hidden />
              Add Role
            </button>
          </div>
          {values.workExperience.map((role, index) => (
            <div
              key={`role-${index}`}
              className="mt-4 rounded-xl border border-border bg-surface-secondary p-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className={labelClassName}>Company Name</span>
                  <input
                    className={inputClassName}
                    value={role.company}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      updateRole(index, { company: event.target.value });
                    }}
                  />
                </label>
                <label>
                  <span className={labelClassName}>Job Title</span>
                  <input
                    className={inputClassName}
                    value={role.title}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      updateRole(index, { title: event.target.value });
                    }}
                  />
                </label>
                <label>
                  <span className={labelClassName}>Start Date</span>
                  <input
                    className={inputClassName}
                    value={role.startDate}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      updateRole(index, { startDate: event.target.value });
                    }}
                  />
                </label>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex-1">
                      <span className={labelClassName}>End Date</span>
                      <input
                        className={inputClassName}
                        placeholder="Present"
                        disabled={role.current}
                        value={role.current ? "" : role.endDate}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          updateRole(index, { endDate: event.target.value });
                        }}
                      />
                    </label>
                    <label className="mt-5 flex items-center gap-2 text-xs font-medium leading-4 text-text-secondary">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border accent-accent"
                        checked={role.current}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          updateRole(index, {
                            current: event.target.checked,
                            endDate: event.target.checked ? "" : role.endDate,
                          });
                        }}
                      />
                      Currently working here
                    </label>
                  </div>
                </div>
                <label className="md:col-span-2">
                  <span className={labelClassName}>Key Responsibilities</span>
                  <textarea
                    className={`${inputClassName} min-h-[96px] resize-none`}
                    value={role.responsibilities}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      updateRole(index, {
                        responsibilities: event.target.value,
                      });
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className={sectionHeadingClassName}>Education</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label>
              <span className={labelClassName}>Highest Degree</span>
              <select
                className={inputClassName}
                value={values.education.degree}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  onChange({
                    education: {
                      ...values.education,
                      degree: event.target.value,
                    },
                  });
                }}
              >
                <option value="">Select</option>
                <option value="high_school">High School</option>
                <option value="associate">Associate</option>
                <option value="bachelor">Bachelor&apos;s</option>
                <option value="master">Master&apos;s</option>
              </select>
            </label>
            <label>
              <span className={labelClassName}>Field of Study</span>
              <input
                className={inputClassName}
                value={values.education.field}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({
                    education: {
                      ...values.education,
                      field: event.target.value,
                    },
                  });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Institution Name</span>
              <input
                className={inputClassName}
                placeholder="e.g. State University"
                value={values.education.institution}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({
                    education: {
                      ...values.education,
                      institution: event.target.value,
                    },
                  });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Graduation Year</span>
              <input
                className={inputClassName}
                placeholder="YYYY"
                value={values.education.year}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({
                    education: {
                      ...values.education,
                      year: event.target.value,
                    },
                  });
                }}
              />
            </label>
          </div>
        </div>

        <div className="mt-10">
          <h3 className={sectionHeadingClassName}>Job Preferences</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className={labelClassName}>Job Titles Seeking</span>
              <input
                className={inputClassName}
                placeholder="Frontend engineer, React developer"
                value={values.jobTitlesSeeking}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ jobTitlesSeeking: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Remote Preference</span>
              <select
                className={inputClassName}
                value={values.remotePreference}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  const next = event.target.value;
                  onChange({
                    remotePreference:
                      next === "any" ||
                      next === "remote" ||
                      next === "hybrid" ||
                      next === "onsite"
                        ? next
                        : "",
                  });
                }}
              >
                <option value="">Select</option>
                <option value="any">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </label>
            <label>
              <span className={labelClassName}>Salary Expectation (Optional)</span>
              <input
                className={inputClassName}
                placeholder="e.g. $70,000"
                value={values.salaryExpectation}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ salaryExpectation: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Preferred Locations (Optional)</span>
              <input
                className={inputClassName}
                placeholder="e.g. New York, London"
                value={values.preferredLocations}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange({ preferredLocations: event.target.value });
                }}
              />
            </label>
            <label>
              <span className={labelClassName}>Cover Letter Tone</span>
              <select
                className={inputClassName}
                value={values.coverLetterTone}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  const next = event.target.value;
                  onChange({
                    coverLetterTone:
                      next === "formal" ||
                      next === "casual" ||
                      next === "enthusiastic"
                        ? next
                        : "",
                  });
                }}
              >
                <option value="">Select</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </label>
          </div>
        </div>

        {statusMessage ? (
          <p
            className={`mt-6 rounded-md border px-3 py-2 text-sm font-medium leading-5 ${
              statusTone === "error"
                ? "border-border bg-accent-muted text-accent"
                : "border-border bg-success-lightest text-success-foreground"
            }`}
          >
            {statusMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-10 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium leading-5 text-accent-foreground hover:bg-accent-dark disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
}
