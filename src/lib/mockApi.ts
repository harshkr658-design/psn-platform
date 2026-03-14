'use client'

// PSN 2.0 Mock API - localStorage Persistence Layer

const STORAGE_KEY = 'psn_demo_state'
const AI_FAILURE_RATE = 0.25
const LATENCY_MS = [200, 800] // [min, max]

export interface Problem {
  id: string
  title: string
  description: string
  evidence?: string
  proposed_solution?: string
  category: string
  author_id: string
  parent_id: string | null
  status: 'open' | 'closed'
  upvotes: number
  avg_score: number
  review_count: number
  source_url?: string
  created_at: string
}

export interface User {
  id: string
  display_name: string
  grs_score: number
  streak: number
  last_active: string
  tier: string
}

export interface Review {
  id: string
  problem_id: string
  reviewer_id: string
  scores: {
    clarity: number
    feasibility: number
    evidence: number
    innovation: number
    realism: number
  }
  comment: string
  created_at: string
}

export interface DemoState {
  problems: Problem[]
  users: User[]
  reviews: Review[]
  mrs_scores: Record<string, number> // user_id -> MRS
  upvotes_log: { user_id: string, problem_id: string }[]
  grs_log: { user_id: string, amount: number, reason: string, created_at: string }[]
  debate_entries: any[]
}

const SEED_DATA: DemoState = {
  users: [
    { id: 'u1', display_name: 'Iron Falcon', grs_score: 340, streak: 12, last_active: new Date().toISOString(), tier: 'Solvers' },
    { id: 'u2', display_name: 'Night Watch', grs_score: 280, streak: 5, last_active: new Date().toISOString(), tier: 'Analyzers' },
    { id: 'u3', display_name: 'Sky Core', grs_score: 150, streak: 2, last_active: new Date().toISOString(), tier: 'Observers' }
  ],
  problems: [
    {
      id: 'p1',
      title: 'Social media algorithms optimise for outrage rather than accuracy',
      description: 'Major platforms use engagement-based ranking that amplifies emotionally charged content over factually accurate content, eroding shared reality.',
      category: 'Technology',
      author_id: 'u2',
      parent_id: null,
      status: 'open',
      upvotes: 47,
      avg_score: 4.3,
      review_count: 12,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'p2',
      title: 'Students memorise answers rather than developing critical thinking',
      description: 'Education systems globally optimise for standardised test scores, rewarding memorisation over reasoning.',
      category: 'Education',
      author_id: 'u3',
      parent_id: null,
      status: 'open',
      upvotes: 38,
      avg_score: 4.1,
      review_count: 9,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ],
  reviews: [],
  mrs_scores: {
    'u1': 4.2,
    'u2': 3.9,
    'u3': 3.5
  },
  upvotes_log: [],
  grs_log: [],
  debate_entries: []
}

// Helper to simulate network latency
const sleep = () => {
    if (typeof window === 'undefined') return Promise.resolve()
    const ms = Math.floor(Math.random() * (LATENCY_MS[1] - LATENCY_MS[0] + 1)) + LATENCY_MS[0]
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const mockApi = {
  init: () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA))
    }
  },

  getState: (): DemoState => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : SEED_DATA
  },

  saveState: (state: DemoState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  fetchProblems: async () => {
    await sleep()
    return mockApi.getState().problems
  },

  fetchProblemById: async (id: string) => {
    await sleep()
    return mockApi.getState().problems.find(p => p.id === id)
  },

  structureInput: async (rawInput: string) => {
    await sleep()
    if (Math.random() < AI_FAILURE_RATE) {
      throw new Error('Anthropic AI structure error')
    }
    // Mock successful AI structuring
    return {
      title: rawInput.slice(0, 50) + (rawInput.length > 50 ? '...' : ''),
      description: rawInput,
      category: 'Technology', // Default
      evidence: 'AI-generated evidence placeholder based on network analysis.',
      proposed_solution: 'AI-generated preliminary solution vector.'
    }
  },

  submitProblem: async (problem: Partial<Problem>) => {
    await sleep()
    const state = mockApi.getState()
    const newProblem: Problem = {
      id: 'p' + Math.random().toString(36).substr(2, 9),
      title: problem.title!,
      description: problem.description!,
      evidence: problem.evidence,
      proposed_solution: problem.proposed_solution,
      category: problem.category || 'Other',
      author_id: 'u1', // Default demo user
      parent_id: problem.parent_id || null,
      status: 'open',
      upvotes: 0,
      avg_score: 0,
      review_count: 0,
      source_url: problem.source_url,
      created_at: new Date().toISOString()
    }
    state.problems.push(newProblem)
    
    // Award GRS
    state.grs_log.push({ user_id: 'u1', amount: 120, reason: 'Problem Submission', created_at: new Date().toISOString() })
    const user = state.users.find(u => u.id === 'u1')
    if (user) user.grs_score += 120

    mockApi.saveState(state)
    return newProblem
  },

  upvoteProblem: async (userId: string, problemId: string) => {
    await sleep()
    const state = mockApi.getState()
    const alreadyUpvoted = state.upvotes_log.find(l => l.user_id === userId && l.problem_id === problemId)
    if (alreadyUpvoted) return

    state.upvotes_log.push({ user_id: userId, problem_id: problemId })
    const problem = state.problems.find(p => p.id === problemId)
    if (problem) {
      problem.upvotes += 1
      // Award author GRS
      const author = state.users.find(u => u.id === problem.author_id)
      if (author) {
        author.grs_score += 20
        state.grs_log.push({ user_id: author.id, amount: 20, reason: 'Received Upvote', created_at: new Date().toISOString() })
      }
    }
    mockApi.saveState(state)
  },

  submitReview: async (reviewerId: string, problemId: string, scores: Review['scores'], comment: string) => {
    await sleep()
    const state = mockApi.getState()
    const problem = state.problems.find(p => p.id === problemId)
    if (!problem) return

    if (problem.author_id === reviewerId) throw new Error('Cannot review own problem')

    const newReview: Review = {
      id: 'r' + Math.random().toString(36).substr(2, 9),
      problem_id: problemId,
      reviewer_id: reviewerId,
      scores,
      comment,
      created_at: new Date().toISOString()
    }
    state.reviews.push(newReview)

    // Recalculate avg score
    const reviewsForProblem = state.reviews.filter(r => r.problem_id === problemId)
    const totalAvg = reviewsForProblem.reduce((acc, r) => {
        const avg = (r.scores.clarity + r.scores.feasibility + r.scores.evidence + r.scores.innovation + r.scores.realism) / 5
        return acc + avg
    }, 0) / reviewsForProblem.length
    problem.avg_score = totalAvg
    problem.review_count = reviewsForProblem.length

    // Update MRS for reviewer (Running average)
    const reviewerReviews = state.reviews.filter(r => r.reviewer_id === reviewerId)
    const reviewerMrs = reviewerReviews.reduce((acc, r) => {
        const avg = (r.scores.clarity + r.scores.feasibility + r.scores.evidence + r.scores.innovation + r.scores.realism) / 5
        return acc + avg
    }, 0) / reviewerReviews.length
    state.mrs_scores[reviewerId] = reviewerMrs

    // Award GRS
    const user = state.users.find(u => u.id === reviewerId)
    if (user) {
        user.grs_score += 50
        state.grs_log.push({ user_id: reviewerId, amount: 50, reason: 'Completed Review', created_at: new Date().toISOString() })
    }

    mockApi.saveState(state)
    return newReview
  },

  fetchChildren: async (parentId: string) => {
    await sleep()
    return mockApi.getState().problems.filter(p => p.parent_id === parentId)
  },

  fetchDebate: async (problemId: string) => {
    await sleep()
    return mockApi.getState().debate_entries.filter(e => e.problem_id === problemId)
  },

  submitDebateEntry: async (entry: any) => {
    await sleep()
    const state = mockApi.getState()
    state.debate_entries.push({
        ...entry,
        id: 'd' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
    })
    mockApi.saveState(state)
  }
}
