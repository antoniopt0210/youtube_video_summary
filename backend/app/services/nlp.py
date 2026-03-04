"""NLP processing: keywords, entities, topic extraction."""
import re
from collections import Counter


def extract_keywords(text: str, top_n: int = 15) -> list[str]:
    """
    Extract top keywords using frequency + simple heuristics.
    No external NLP lib required for minimal setup.
    """
    if not text or len(text) < 50:
        return []

    # Common stopwords
    stopwords = {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
        "be", "have", "has", "had", "do", "does", "did", "will", "would",
        "could", "should", "may", "might", "must", "shall", "can", "need",
        "this", "that", "these", "those", "it", "its", "i", "you", "we",
        "they", "he", "she", "what", "which", "who", "when", "where", "how",
    }

    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    filtered = [w for w in words if w not in stopwords]
    counts = Counter(filtered)
    return [w for w, _ in counts.most_common(top_n)]


def extract_entities_simple(text: str, top_n: int = 10) -> list[str]:
    """
    Simple named entity extraction: capitalized phrases.
    For production, use spaCy: nlp(text).ents
    """
    if not text:
        return []
    # Match capitalized words (potential proper nouns)
    entities = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b", text)
    counts = Counter(entities)
    return [e for e, _ in counts.most_common(top_n)]
