"""LLM-powered summarization using OpenAI API."""
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def summarize_transcript(
    transcript: str,
    title: str = "Video",
    max_tokens: int = 1500,
) -> dict:
    """
    Generate structured summary: overview, key points, and chapters.
    """
    if not transcript or len(transcript.strip()) < 50:
        return {
            "overview": "Transcript too short to summarize.",
            "key_points": [],
            "chapters": [],
        }

    prompt = f"""You are an expert at summarizing educational and informational content.

Analyze this transcript from "{title}" and provide:

1. **Overview** (2-4 sentences): A concise summary of the main topic and purpose.
2. **Key Points** (5-8 bullet points): The most important takeaways.
3. **Chapters** (if discernible): Timestamp-based sections with titles. Format as: [MM:SS] Chapter Title. If no clear chapters, return empty list.

Transcript:
---
{transcript[:12000]}
---

Respond in JSON format:
{{"overview": "...", "key_points": ["...", "..."], "chapters": [["00:00", "Introduction"], ...]}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.3,
        )
        content = response.choices[0].message.content or ""
        if not content.strip():
            return {"overview": "Summarization returned empty response.", "key_points": [], "chapters": []}
        # Extract JSON from response (handle markdown code blocks)
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        data = json.loads(content)
        return {
            "overview": data.get("overview", ""),
            "key_points": data.get("key_points", []),
            "chapters": data.get("chapters", []),
        }
    except (json.JSONDecodeError, KeyError, Exception) as e:
        return {
            "overview": f"Summarization failed: {str(e)}",
            "key_points": [],
            "chapters": [],
        }
