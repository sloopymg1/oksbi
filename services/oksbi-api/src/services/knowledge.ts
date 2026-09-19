import { randomUUID } from 'node:crypto';
import type { DatabaseService, KnowledgeService } from './interfaces.js';
import type { KnowledgeAnswer, KnowledgeDocument, KnowledgeDocumentRequest, KnowledgeQuestion, ResearchQuestion, User } from '../shared.js';
import { createAuditFields } from '../utils/records.js';
import { ForbiddenError } from '../errors/errorTypes.js';

type ScoredDocument = { document: KnowledgeDocument; score: number; excerpt: string };

function terms(value: string): string[] {
  return [...new Set(value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(term => term.length > 2))];
}

function rank(documents: KnowledgeDocument[], question: string): ScoredDocument[] {
  const questionTerms = terms(question);
  return documents.map(document => {
    const haystack = `${document.title} ${document.content} ${document.tags.join(' ')}`.toLowerCase();
    const hits = questionTerms.filter(term => haystack.includes(term));
    const score = questionTerms.length ? hits.length / questionTerms.length : 0;
    const firstHit = hits.length ? haystack.indexOf(hits[0]!) : 0;
    const start = Math.max(0, firstHit - 140);
    return { document, score, excerpt: document.content.slice(start, start + 320).trim() };
  }).filter(item => item.score > 0).sort((left, right) => right.score - left.score).slice(0, 5);
}

function answerFromRanked(ranked: ScoredDocument[], researched = false): KnowledgeAnswer {
  const best = ranked[0];
  const confidence = best && best.score >= .55 ? 'high' : best && best.score >= .25 ? 'medium' : ranked.length ? 'low' : 'none';
  const answer = ranked.length
    ? `Based on ${ranked.length} indexed source${ranked.length === 1 ? '' : 's'}, the closest answer is: ${best!.excerpt}`
    : researched ? 'The research agent found no readable source content for this question.' : 'I could not find this in the indexed knowledge base. Try adding a source document or ask the research agent to look externally.';
  return { answer, confidence, researched, sources: ranked.map(item => ({ id: item.document.id, title: item.document.title, source: item.document.source, excerpt: item.excerpt, score: Math.round(item.score * 100) })) };
}

export class DefaultKnowledgeService implements KnowledgeService {
  constructor(private readonly database: DatabaseService) {}

  async list(actor: User): Promise<KnowledgeDocument[]> {
    if (!actor.roles.includes('admin')) throw new ForbiddenError('Only administrators can view RAG sources.');
    return this.database.findMany<KnowledgeDocument>('knowledgeDocument', { filter: actor.roles.includes('admin') ? {} : { ownerUserId: actor.id }, orderBy: 'createdAt', orderDirection: 'desc' });
  }

  async create(actor: User, input: KnowledgeDocumentRequest): Promise<KnowledgeDocument> {
    if (!actor.roles.includes('admin')) throw new ForbiddenError('Only administrators can add RAG sources.');
    return this.database.create<KnowledgeDocument>('knowledgeDocument', { ...createAuditFields(actor), ownerUserId: actor.id, ...input });
  }

  async answer(actor: User | undefined, input: KnowledgeQuestion): Promise<KnowledgeAnswer> {
    let documents: KnowledgeDocument[] = [];
    try {
      documents = actor ? await this.list(actor) : await this.database.findMany<KnowledgeDocument>('knowledgeDocument', { orderBy: 'createdAt', orderDirection: 'desc' });
    } catch {
      if (actor) throw new ForbiddenError('Unable to access the knowledge base.');
    }
    return answerFromRanked(rank(documents, input.question));
  }

  async research(actor: User | undefined, input: ResearchQuestion): Promise<KnowledgeAnswer> {
    let documents: KnowledgeDocument[] = [];
    try {
      documents = actor ? await this.list(actor) : await this.database.findMany<KnowledgeDocument>('knowledgeDocument', { orderBy: 'createdAt', orderDirection: 'desc' });
    } catch {
      if (actor) throw new ForbiddenError('Unable to access the knowledge base.');
    }
    const external: KnowledgeDocument[] = [];
    const searchUrls = [...input.urls];
    if (searchUrls.length === 0) {
      try {
        const searchResponse = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(input.question)}`, { signal: AbortSignal.timeout(8000) });
        const searchHtml = await searchResponse.text();
        const discovered = [...searchHtml.matchAll(/result__a[^>]+href="([^"]+)"/g)].map(match => match[1]).filter((url): url is string => !!url && url.startsWith('http')).slice(0, 3);
        searchUrls.push(...discovered);
      } catch { /* Public search is optional; local retrieval remains available. */ }
    }
    for (const url of searchUrls.slice(0, 5)) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!response.ok) continue;
        const text = (await response.text()).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (text) external.push({ ...createAuditFields(actor), ownerUserId: actor?.id ?? 'public', title: new URL(url).hostname, source: url, content: text.slice(0, 10000), tags: [] });
      } catch { /* An unavailable source should not block the local answer. */ }
    }
    return answerFromRanked(rank([...documents, ...external], input.question), true);
  }
}