from typing import List, Dict
import re


# Common keywords for different types of screening questions
KEYWORD_CATEGORIES = {
    "technical": [
        "algorithm", "data structure", "optimization", "performance", "scalability",
        "architecture", "design pattern", "testing", "debugging", "api", "database",
        "framework", "library", "version control", "git"
    ],
    "problem_solving": [
        "analyze", "solution", "approach", "strategy", "methodology", "process",
        "steps", "plan", "evaluate", "consider", "alternative", "trade-off"
    ],
    "communication": [
        "collaborate", "team", "communicate", "explain", "present", "document",
        "feedback", "stakeholder", "meeting", "discussion", "clear", "concise"
    ],
    "experience": [
        "project", "experience", "worked", "developed", "implemented", "built",
        "created", "managed", "led", "contributed", "delivered", "achieved"
    ]
}


def detect_question_category(question_text: str) -> str:
    """
    Detect the category of a screening question.
    
    Args:
        question_text: The screening question text
        
    Returns:
        Category name ('technical', 'problem_solving', 'communication', 'experience', or 'general')
    """
    question_lower = question_text.lower()
    
    # Count keyword matches for each category
    category_scores = {}
    for category, keywords in KEYWORD_CATEGORIES.items():
        score = sum(1 for keyword in keywords if keyword in question_lower)
        category_scores[category] = score
    
    # Return category with highest score, or 'general' if no matches
    if max(category_scores.values()) > 0:
        return max(category_scores, key=category_scores.get)
    return "general"


def extract_keywords_from_answer(answer_text: str, min_word_length: int = 4) -> List[str]:
    """
    Extract meaningful keywords from answer text.
    
    Args:
        answer_text: The candidate's answer
        min_word_length: Minimum length for a word to be considered a keyword
        
    Returns:
        List of extracted keywords
    """
    # Remove special characters and convert to lowercase
    text = re.sub(r'[^\w\s]', ' ', answer_text.lower())
    
    # Split into words
    words = text.split()
    
    # Common stop words to exclude
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
        'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your',
        'his', 'her', 'its', 'our', 'their'
    }
    
    # Filter keywords
    keywords = [
        word for word in words
        if len(word) >= min_word_length and word not in stop_words
    ]
    
    # Remove duplicates while preserving order
    return list(dict.fromkeys(keywords))


def score_answer_by_keywords(
    answer_text: str,
    expected_keywords: List[str],
    question_category: str = "general"
) -> Dict:
    """
    Score an answer based on keyword matching.
    
    Args:
        answer_text: The candidate's answer
        expected_keywords: List of keywords expected in the answer
        question_category: Category of the question
        
    Returns:
        Dictionary with score and matched keywords
    """
    answer_lower = answer_text.lower()
    
    # Find matched keywords
    matched_keywords = []
    for keyword in expected_keywords:
        if keyword.lower() in answer_lower:
            matched_keywords.append(keyword)
    
    # Calculate base score
    if expected_keywords:
        match_ratio = len(matched_keywords) / len(expected_keywords)
    else:
        match_ratio = 0.5  # Neutral score if no expected keywords
    
    # Adjust score based on answer length (penalize very short answers)
    word_count = len(answer_text.split())
    length_factor = min(1.0, word_count / 50)  # Optimal around 50 words
    
    # Combine factors
    base_score = match_ratio * 10  # Scale to 0-10
    length_adjusted_score = base_score * (0.7 + 0.3 * length_factor)
    
    # Ensure score is between 0 and 10
    final_score = round(min(10.0, max(0.0, length_adjusted_score)), 2)
    
    return {
        "score": final_score,
        "matched_keywords": matched_keywords,
        "total_keywords": len(expected_keywords),
        "match_ratio": round(match_ratio, 2),
        "word_count": word_count
    }


def score_answer_auto(answer_text: str, question_text: str) -> Dict:
    """
    Automatically score an answer without predefined keywords.
    
    Uses question category and general quality indicators.
    
    Args:
        answer_text: The candidate's answer
        question_text: The screening question
        
    Returns:
        Dictionary with score and analysis
    """
    # Detect question category
    category = detect_question_category(question_text)
    
    # Get relevant keywords for the category
    category_keywords = KEYWORD_CATEGORIES.get(category, [])
    
    # Extract keywords from question to use as expected keywords
    question_keywords = extract_keywords_from_answer(question_text)
    
    # Combine category keywords and question keywords
    all_expected_keywords = list(set(category_keywords + question_keywords))
    
    # Score the answer
    result = score_answer_by_keywords(answer_text, all_expected_keywords, category)
    result["category"] = category
    
    return result


def calculate_overall_screening_score(answer_scores: List[Dict]) -> float:
    """
    Calculate overall screening score from individual answer scores.
    
    Args:
        answer_scores: List of dictionaries with individual answer scores
        
    Returns:
        Overall score as percentage (0-100)
    """
    if not answer_scores:
        return 0.0
    
    # Calculate average score
    total_score = sum(score["score"] for score in answer_scores)
    avg_score = total_score / len(answer_scores)
    
    # Convert to percentage (0-10 scale to 0-100 scale)
    percentage = (avg_score / 10) * 100
    
    return round(percentage, 2)
