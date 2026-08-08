// Site-wide constants. Anything referenced from more than one page belongs
// here rather than being retyped — the LinkedIn URL was previously hardcoded
// in three files.

export const SITE_TITLE = 'Stephanie Liu';
export const SITE_DESCRIPTION =
  'Stephanie Liu — design engineer in San Francisco. Previously Google, Waymo, and Nuro.';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/stephanieliu14';
export const GITHUB_URL = 'https://www.github.com/sliuu';
/** The site's one contact address — the header's mail icon and every
 *  "Get in touch" button. */
export const EMAIL_URL = 'mailto:stephliu.work@gmail.com';

/** This site's own repository, linked from the footer. */
export const SOURCE_URL = 'https://github.com/sliuu/personal-website';

/** Lives in public/, so Astro copies it through untouched and the URL is stable. */
export const RESUME_URL = '/resume_2026.pdf';
