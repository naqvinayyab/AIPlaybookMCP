/**
 * Programmatic fixture generator for test data
 * Generates markdown documentation fixtures from JSON schema
 * Ensures both test data and actual documentation follow the same structure (FR-009)
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

/**
 * Fixture schema interface matching doc-schema.json
 */
export interface DocumentFixture {
  filename: string;
  title: string;
  sections: Section[];
  wordCount?: number;
  tags?: string[];
  metadata?: {
    generatedAt?: string;
    schemaVersion?: string;
    checksum?: string;
  };
}

export interface Section {
  heading: string;
  content: string;
  subsections?: Subsection[];
}

export interface Subsection {
  heading: string;
  content: string;
}

/**
 * Generate markdown content from fixture definition
 */
export function generateMarkdownFromFixture(fixture: DocumentFixture): string {
  let markdown = `# ${fixture.title}\n\n`;

  for (const section of fixture.sections) {
    markdown += `## ${section.heading}\n\n`;
    markdown += `${section.content}\n\n`;

    if (section.subsections) {
      for (const subsection of section.subsections) {
        markdown += `### ${subsection.heading}\n\n`;
        markdown += `${subsection.content}\n\n`;
      }
    }
  }

  return markdown;
}

/**
 * Generate fixture and write to test directory
 * Returns path to generated file
 */
export function createFixture(fixture: DocumentFixture, tempDir?: string): string {
  const fixtureDir = tempDir || join(process.cwd(), 'tests', 'fixtures', 'generated');

  // Ensure fixture directory exists
  if (!existsSync(fixtureDir)) {
    mkdirSync(fixtureDir, { recursive: true });
  }

  // Generate markdown content
  const markdown = generateMarkdownFromFixture(fixture);

  // Add metadata
  const metadata = {
    generatedAt: new Date().toISOString(),
    schemaVersion: '1.0.0',
    checksum: createHash('sha256').update(markdown).digest('hex'),
  };

  const fixtureWithMetadata: DocumentFixture = {
    ...fixture,
    metadata,
  };

  // Write markdown file
  const filepath = join(fixtureDir, fixture.filename);
  writeFileSync(filepath, markdown, 'utf-8');

  // Write metadata file
  const metadataPath = filepath.replace('.md', '.meta.json');
  writeFileSync(metadataPath, JSON.stringify(fixtureWithMetadata, null, 2), 'utf-8');

  return filepath;
}

/**
 * Load fixture schema from schemas directory
 */
export function loadFixtureSchema(): unknown {
  const schemaPath = join(process.cwd(), 'tests', 'fixtures', 'schemas', 'doc-schema.json');
  const schemaContent = readFileSync(schemaPath, 'utf-8');
  return JSON.parse(schemaContent);
}

/**
 * Validate fixture against schema
 * Basic validation - checks required fields
 */
export function validateFixture(fixture: DocumentFixture): boolean {
  if (!fixture.filename?.endsWith('.md')) {
    throw new Error('Fixture must have filename ending with .md');
  }

  if (!fixture.title || fixture.title.length < 5) {
    throw new Error('Fixture must have title with at least 5 characters');
  }

  if (!fixture.sections || fixture.sections.length === 0) {
    throw new Error('Fixture must have at least one section');
  }

  for (const section of fixture.sections) {
    if (!section.heading || section.heading.length < 3) {
      throw new Error('Each section must have heading with at least 3 characters');
    }
    if (!section.content || section.content.length < 50) {
      throw new Error('Each section must have content with at least 50 characters');
    }
  }

  return true;
}

/**
 * Create a standard test fixture with common content
 */
export function createStandardFixture(): DocumentFixture {
  return {
    filename: 'test-document.md',
    title: 'Test AI Playbook Document',
    sections: [
      {
        heading: 'Introduction',
        content:
          'This is a test document for the AI Playbook MCP server. It contains sample content for testing purposes and validates that the server correctly serves documentation.',
      },
      {
        heading: 'Key Concepts',
        content:
          'This section contains key concepts about AI governance, including responsible AI use, ethical considerations, and best practices for government deployments.',
        subsections: [
          {
            heading: 'Governance Framework',
            content:
              'A governance framework ensures AI systems are developed and deployed responsibly.',
          },
        ],
      },
      {
        heading: 'Implementation Guidelines',
        content:
          'Follow these guidelines when implementing AI solutions in government context. Ensure compliance with all relevant regulations and standards.',
      },
    ],
    wordCount: 150,
    tags: ['principles', 'testing'],
  };
}

/**
 * Cleanup function to remove all generated fixtures
 * Ensures test isolation (FR-014)
 */
export function cleanupFixtures(tempDir?: string): void {
  const fixtureDir = tempDir || join(process.cwd(), 'tests', 'fixtures', 'generated');

  if (existsSync(fixtureDir)) {
    // Remove all files in generated directory
    rmSync(fixtureDir, { recursive: true, force: true });
    // Recreate empty directory
    mkdirSync(fixtureDir, { recursive: true });
  }
}
