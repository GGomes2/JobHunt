export type OAuthProvider = "google" | "github";

export type PostHogEventMap = {
  oauth_sign_in_started: {
    provider: OAuthProvider;
  };
  oauth_sign_in_completed: {
    userId: string;
  };
  sign_out_clicked: {
    userId: string;
  };
  job_search_started: {
    userId: string;
    jobTitle: string;
    location: string;
  };
  job_found: {
    userId: string;
    source: string;
    matchScore: number;
  };
  profile_completed: {
    userId: string;
  };
  company_researched: {
    userId: string;
    jobId: string;
    company: string;
  };
};

export type PostHogEventName = keyof PostHogEventMap;

export type PostHogEventProperties<TEvent extends PostHogEventName> =
  PostHogEventMap[TEvent];
