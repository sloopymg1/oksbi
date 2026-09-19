ALTER TABLE onboarding_profiles DROP CONSTRAINT IF EXISTS onboarding_profiles_status_check;
ALTER TABLE onboarding_profiles ADD CONSTRAINT onboarding_profiles_status_check CHECK (status IN ('in_process', 'approved', 'suspended', 'contact_admin'));
