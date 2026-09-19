/** Curated directory, verified 2026-09-18. Listing does not imply an OKSBI partnership. */
export const musicOrganizations = [
  { id: 'ghamro', name: 'GHAMRO', kind: 'CMO', region: 'Ghana', website: 'https://ghamroonline.org/', description: 'Collective management of music rights and royalty collection.' },
  { id: 'capasso', name: 'CAPASSO', kind: 'CMO', region: 'South Africa', website: 'https://www.capasso.co.za/', description: 'Mechanical and digital rights administration.' },
  { id: 'samro', name: 'SAMRO', kind: 'PRO', region: 'South Africa', website: 'https://www.samro.org.za/', description: 'Performing rights administration for composers, authors and publishers.' },
  { id: 'bmi', name: 'BMI', kind: 'PRO', region: 'United States', website: 'https://www.bmi.com/', description: 'Performing rights organization for songwriters, composers and publishers.' },
  { id: 'sony-music-publishing', name: 'Sony Music Publishing', kind: 'publisher', region: 'International', website: 'https://www.sonymusicpub.com/', description: 'Music publishing and administration. Representation requires an agreement.' },
  { id: 'ghmusic-publishing', name: 'GHMusic Publishing and Management', kind: 'publisher', region: 'Ghana', website: 'https://ghmusicpublishing.com/about/', description: 'Music publishing and management. Representation requires an agreement.' },
] as const;
export type MusicOrganization = typeof musicOrganizations[number];
