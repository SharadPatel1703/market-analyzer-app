import numpy as np
from typing import List, Dict
from datetime import datetime, timedelta


def generate_time_series_data(days: int = 30) -> List[Dict]:
    """Generate dummy time series data for testing"""
    base = datetime.now()
    dates = [base - timedelta(days=x) for x in range(days)]

    return [{
        'date': date.strftime('%Y-%m-%d'),
        'value': np.random.normal(100, 10),
        'trend': np.random.choice(['up', 'down', 'stable'])
    } for date in dates]


def calculate_trend_strength(values: List[float]) -> float:
    """Calculate the strength of a trend"""
    if len(values) < 2:
        return 0

    # Calculate the average rate of change
    changes = np.diff(values)
    return float(np.mean(changes))


def extract_keywords(text: str, top_n: int = 5) -> List[str]:
    """Extract key terms from text"""
    # In a real application, you'd want to use proper NLP here
    words = text.lower().split()
    # Remove common words
    stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to'}
    words = [w for w in words if w not in stopwords]

    # Count frequencies
    from collections import Counter
    counts = Counter(words)

    # Return top N words
    return [word for word, _ in counts.most_common(top_n)]


def calculate_market_position(
        target_embedding: np.ndarray,
        competitor_embeddings: List[np.ndarray]
) -> Dict:
    """Calculate market position relative to competitors"""
    similarities = [
        float(np.dot(target_embedding, comp_emb) /
              (np.linalg.norm(target_embedding) * np.linalg.norm(comp_emb)))
        for comp_emb in competitor_embeddings
    ]

    return {
        'average_similarity': float(np.mean(similarities)),
        'max_similarity': float(np.max(similarities)),
        'min_similarity': float(np.min(similarities)),
        'uniqueness_score': float(1 - np.mean(similarities))
    }