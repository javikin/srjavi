import { NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/api-auth';
import { getOctokit } from '@/lib/github';

export async function GET() {
  try {
    await requireAdmin();
    const octokit = getOctokit();

    const repos: Array<{ full_name: string; name: string; owner: string; private: boolean }> = [];
    let page = 1;

    // Paginate through all repos
    while (true) {
      const { data } = await octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
        page,
      });

      if (data.length === 0) break;

      for (const repo of data) {
        repos.push({
          full_name: repo.full_name,
          name: repo.name,
          owner: repo.owner.login,
          private: repo.private,
        });
      }

      if (data.length < 100) break;
      page++;
    }

    return NextResponse.json({ data: repos });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : 'Error al obtener repositorios';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
