"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { saveProfile } from "@/actions/profile";
import { ProfileAttentionBanner } from "@/components/profile/ProfileAttentionBanner";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { getProfileCompletion } from "@/lib/profile-completion";
import type { ProfileFormValues } from "@/types";

type ProfileEditorProps = {
  userId: string;
  initialValues: ProfileFormValues;
};

export function ProfileEditor({
  userId,
  initialValues,
}: ProfileEditorProps): ReactElement {
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success">("success");
  const completion = useMemo(() => getProfileCompletion(values), [values]);

  const updateValues = (patch: Partial<ProfileFormValues>): void => {
    setValues((current) => ({ ...current, ...patch }));
    setStatusMessage(null);
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setStatusMessage(null);

    const result = await saveProfile({
      fullName: values.fullName,
      phone: values.phone,
      location: values.location,
      linkedinUrl: values.linkedinUrl,
      portfolioUrl: values.portfolioUrl,
      workAuthorization: values.workAuthorization,
      currentTitle: values.currentTitle,
      experienceLevel: values.experienceLevel,
      yearsExperience: values.yearsExperience,
      skills: values.skills,
      industries: values.industries,
      workExperience: values.workExperience,
      education: values.education,
      jobTitlesSeeking: values.jobTitlesSeeking,
      remotePreference: values.remotePreference,
      salaryExpectation: values.salaryExpectation,
      preferredLocations: values.preferredLocations,
      coverLetterTone: values.coverLetterTone,
      resumePdfUrl: values.resumePdfUrl,
      resumePdfKey: values.resumePdfKey,
    });

    setIsSaving(false);

    if (!result.success) {
      setStatusTone("error");
      setStatusMessage(result.error ?? "Could not save your profile.");
      return;
    }

    setStatusTone("success");
    setStatusMessage(
      result.isComplete
        ? "Profile saved. You're ready for stronger matches."
        : "Profile saved.",
    );
  };

  return (
    <>
      <ProfileAttentionBanner
        completionPercentage={completion.percentage}
        missingFields={completion.missingFields}
        isComplete={completion.isComplete}
      />
      <ResumeUpload
        userId={userId}
        resumePdfUrl={values.resumePdfUrl}
        resumePdfKey={values.resumePdfKey}
        onUploaded={(resumePdfUrl, resumePdfKey) => {
          updateValues({ resumePdfUrl, resumePdfKey });
        }}
      />
      <ProfileForm
        values={values}
        isSaving={isSaving}
        statusMessage={statusMessage}
        statusTone={statusTone}
        onChange={updateValues}
        onSave={handleSave}
      />
    </>
  );
}
