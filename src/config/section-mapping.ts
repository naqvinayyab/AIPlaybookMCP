/**
 * Section Mapping Configuration
 *
 * Maps gov.uk HTML heading IDs to markdown filenames
 * Feature: 002-dynamic-api-content
 */

import type { SectionMapping } from '../models/section-mapping.js';

/**
 * Configuration-driven mapping of HTML sections to markdown files
 * Priority-ordered heading IDs with fallback patterns
 */
export const SECTION_MAPPINGS: SectionMapping[] = [
  {
    filename: 'principles.md',
    headingIds: ['principles', 'the-10-principles', 'principle-1'],
    description: 'The 10 Principles section',
    headingTextPatterns: [/^principles$/i, /^10.*principles$/i]
  },
  {
    filename: 'understanding_ai.md',
    headingIds: ['understanding-ai', 'understanding-artificial-intelligence', 'what-is-ai'],
    description: 'Understanding AI section',
    headingTextPatterns: [/^understanding.*ai$/i]
  },
  {
    filename: 'using_ai_safely_responsibly.md',
    headingIds: ['using-ai-safely-responsibly', 'using-ai-safely-and-responsibly', 'safe-use'],
    description: 'Using AI Safely and Responsibly section',
    headingTextPatterns: [/^using.*ai.*safely/i]
  },
  {
    filename: 'building_ai_solutions.md',
    headingIds: ['building-ai-solutions', 'building-solutions', 'developing-ai'],
    description: 'Building AI Solutions section',
    headingTextPatterns: [/^building.*ai/i]
  },
  {
    filename: 'buying_ai.md',
    headingIds: ['buying-ai', 'procuring-ai', 'procurement'],
    description: 'Buying AI section',
    headingTextPatterns: [/^buying.*ai$/i, /^procuring/i]
  },
  {
    filename: 'governance.md',
    headingIds: ['governance', 'ai-governance', 'governing-ai'],
    description: 'Governance section',
    headingTextPatterns: [/^governance$/i]
  },
  {
    filename: 'security.md',
    headingIds: ['security', 'ai-security', 'securing-ai'],
    description: 'Security section',
    headingTextPatterns: [/^security$/i]
  },
  {
    filename: 'data_protection_privacy.md',
    headingIds: ['data-protection-privacy', 'data-protection', 'privacy', 'data-privacy'],
    description: 'Data Protection and Privacy section',
    headingTextPatterns: [/^data.*protection/i, /^privacy$/i]
  },
  {
    filename: 'legal_considerations.md',
    headingIds: ['legal-considerations', 'legal', 'legal-aspects'],
    description: 'Legal Considerations section',
    headingTextPatterns: [/^legal/i]
  },
  {
    filename: 'appendix_use_cases.md',
    headingIds: ['appendix-use-cases', 'use-cases', 'appendix', 'case-studies'],
    description: 'Appendix Use Cases section',
    headingTextPatterns: [/^appendix/i, /^use.*cases$/i]
  }
];

/**
 * Validates that all section mappings are properly configured
 */
export function validateSectionMappings(mappings: SectionMapping[]): void {
  if (mappings.length !== 10) {
    throw new Error(`Expected exactly 10 section mappings, got ${mappings.length}`);
  }

  const filenames = new Set<string>();
  for (const mapping of mappings) {
    if (!mapping.filename.endsWith('.md')) {
      throw new Error(`Invalid filename "${mapping.filename}": must end with .md`);
    }
    if (filenames.has(mapping.filename)) {
      throw new Error(`Duplicate filename "${mapping.filename}" in mappings`);
    }
    if (mapping.headingIds.length === 0) {
      throw new Error(`Empty headingIds for "${mapping.filename}"`);
    }
    filenames.add(mapping.filename);
  }
}

// Validate mappings on module load
validateSectionMappings(SECTION_MAPPINGS);
