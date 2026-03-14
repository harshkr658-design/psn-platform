import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { raw } = await req.json()
    const apiKey = process.env.ANTHROPIC_API_KEY

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        system: "You are a problem structuring assistant. Extract and structure the core problem from any input — links, opinions, rants, or articles. Return ONLY a JSON object with these exact keys: title (one clear sentence), description (2-3 sentences, neutral tone), evidence (facts or context supporting the problem), proposed_solution (initial idea or 'Open for solutions'), category (exactly one of: Environment, Social, Technology, Health, Education, Economy, Politics, Personal, Other), impact (who is affected and how). Be concise and objective.",
        messages: [{ role: 'user', content: raw }]
      })
    })

    const data = await res.json()
    // Extract JSON from response (handling potential markdown blocks)
    let text = data.content[0].text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) text = jsonMatch[0]
    
    return NextResponse.json(JSON.parse(text))
  } catch (error) {
    console.error('AI Structure Error:', error)
    return NextResponse.json({ error: 'Failed to structure' }, { status: 500 })
  }
}
