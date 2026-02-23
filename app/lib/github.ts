export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export interface ProcessedRepo {
  id: number;
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

const GITHUB_USERNAME = 'Xndr2';
const GITHUB_API_BASE = 'https://api.github.com';

// Repos to exclude from the list (e.g., forks, old projects)
const EXCLUDED_REPOS: string[] = [];

// Repos to pin at the top (in order)
const PINNED_REPOS: string[] = [
  'GameDevWiki',
  'Abandoned-Bot',
  'Graphics_Renderer',
];

export async function fetchGitHubRepos(): Promise<ProcessedRepo[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  const repos: GitHubRepo[] = await response.json();

  // Filter and process repos
  const processedRepos = repos
    .filter(
      repo =>
        !repo.fork && !repo.archived && !EXCLUDED_REPOS.includes(repo.name)
    )
    .map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
    }));

  // Sort: pinned repos first, then by stars
  return processedRepos.sort((a, b) => {
    const aIndex = PINNED_REPOS.indexOf(a.name);
    const bIndex = PINNED_REPOS.indexOf(b.name);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return b.stars - a.stars;
  });
}

// Language color mapping for visual display
export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  'C++': '#f34b7d',
  'C#': '#178600',
  C: '#555555',
  Java: '#b07219',
  Rust: '#dea584',
  Go: '#00ADD8',
  GDScript: '#355570',
  Lua: '#000080',
  HTML: '#e34c26',
  CSS: '#563d7c',
  HLSL: '#aace60',
};
