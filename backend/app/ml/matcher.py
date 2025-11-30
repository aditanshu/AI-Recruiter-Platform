from typing import List, Tuple
from app.models import Candidate, Job


def parse_skills(skills_text: str) -> List[str]:
    """
    Parse comma-separated skills string into a list.
    
    Args:
        skills_text: Comma-separated skills string
        
    Returns:
        List of skill strings (lowercase, stripped)
    """
    if not skills_text:
        return []
    
    return [skill.strip().lower() for skill in skills_text.split(',') if skill.strip()]


def compute_skills_match(candidate_skills: List[str], job_skills: List[str]) -> Tuple[float, List[str], List[str]]:
    """
    Compute skill match percentage between candidate and job.
    
    Args:
        candidate_skills: List of candidate's skills
        job_skills: List of job's required skills
        
    Returns:
        Tuple of (match_percentage, matched_skills, missing_skills)
    """
    if not job_skills:
        return 100.0, [], []  # If no skills required, perfect match
    
    if not candidate_skills:
        return 0.0, [], job_skills  # No skills means no match
    
    # Convert to sets for comparison (case-insensitive)
    candidate_set = set(skill.lower() for skill in candidate_skills)
    job_set = set(skill.lower() for skill in job_skills)
    
    # Find matched and missing skills
    matched = list(candidate_set.intersection(job_set))
    missing = list(job_set.difference(candidate_set))
    
    # Calculate match percentage
    match_percentage = (len(matched) / len(job_set)) * 100
    
    return match_percentage, matched, missing


def compute_experience_match(candidate_exp: int, job_min_exp: int, job_max_exp: int = None) -> Tuple[bool, float]:
    """
    Compute experience match between candidate and job.
    
    Args:
        candidate_exp: Candidate's years of experience
        job_min_exp: Job's minimum required experience
        job_max_exp: Job's maximum experience (optional)
        
    Returns:
        Tuple of (is_match, penalty_factor)
        - is_match: True if candidate meets minimum requirement
        - penalty_factor: 0-1 multiplier based on experience gap
    """
    if candidate_exp >= job_min_exp:
        # Candidate meets or exceeds minimum
        if job_max_exp and candidate_exp > job_max_exp:
            # Overqualified - small penalty
            penalty = 0.95
        else:
            # Perfect match
            penalty = 1.0
        return True, penalty
    else:
        # Under-qualified
        gap = job_min_exp - candidate_exp
        if gap <= 1:
            # Close enough - small penalty
            penalty = 0.9
        elif gap <= 2:
            # Moderate gap
            penalty = 0.7
        else:
            # Large gap
            penalty = 0.5
        return False, penalty


def compute_location_match(candidate_location: str, job_location: str, remote_type: str) -> Tuple[bool, float]:
    """
    Compute location match between candidate and job.
    
    Args:
        candidate_location: Candidate's location
        job_location: Job's location
        remote_type: Job's remote type ('on-site', 'remote', 'hybrid')
        
    Returns:
        Tuple of (is_match, penalty_factor)
    """
    # Remote jobs match everyone
    if remote_type == "remote":
        return True, 1.0
    
    # If no location data, assume match with small penalty
    if not candidate_location or not job_location:
        return True, 0.9
    
    # Simple location matching (case-insensitive contains)
    candidate_loc_lower = candidate_location.lower()
    job_loc_lower = job_location.lower()
    
    # Check if locations match (either way)
    if job_loc_lower in candidate_loc_lower or candidate_loc_lower in job_loc_lower:
        return True, 1.0
    
    # Hybrid jobs with location mismatch - moderate penalty
    if remote_type == "hybrid":
        return False, 0.85
    
    # On-site with location mismatch - larger penalty
    return False, 0.6


def compute_match_score(candidate: Candidate, job: Job) -> float:
    """
    Compute overall match score between a candidate and a job.
    
    The score is calculated based on:
    1. Skills match (60% weight)
    2. Experience match (25% weight)
    3. Location match (15% weight)
    
    Args:
        candidate: Candidate model instance
        job: Job model instance
        
    Returns:
        Match score as a float between 0 and 100
    """
    # Parse skills
    candidate_skills = parse_skills(candidate.skills_text)
    job_skills = parse_skills(job.skills_required)
    
    # 1. Skills Match (60% weight)
    skills_match_pct, matched_skills, missing_skills = compute_skills_match(candidate_skills, job_skills)
    skills_score = skills_match_pct * 0.6
    
    # 2. Experience Match (25% weight)
    exp_match, exp_penalty = compute_experience_match(
        candidate.experience_years or 0,
        job.experience_min or 0,
        job.experience_max
    )
    # Base experience score on whether they meet minimum
    exp_base_score = 100 if exp_match else 50
    exp_score = (exp_base_score * exp_penalty) * 0.25
    
    # 3. Location Match (15% weight)
    loc_match, loc_penalty = compute_location_match(
        candidate.location,
        job.location,
        job.remote_type
    )
    # Base location score on whether they match
    loc_base_score = 100 if loc_match else 50
    loc_score = (loc_base_score * loc_penalty) * 0.15
    
    # Calculate total score
    total_score = skills_score + exp_score + loc_score
    
    # Ensure score is between 0 and 100
    return round(min(100.0, max(0.0, total_score)), 2)


def get_match_details(candidate: Candidate, job: Job) -> dict:
    """
    Get detailed match information between candidate and job.
    
    Args:
        candidate: Candidate model instance
        job: Job model instance
        
    Returns:
        Dictionary with detailed match information
    """
    candidate_skills = parse_skills(candidate.skills_text)
    job_skills = parse_skills(job.skills_required)
    
    skills_match_pct, matched_skills, missing_skills = compute_skills_match(candidate_skills, job_skills)
    exp_match, exp_penalty = compute_experience_match(
        candidate.experience_years or 0,
        job.experience_min or 0,
        job.experience_max
    )
    loc_match, loc_penalty = compute_location_match(
        candidate.location,
        job.location,
        job.remote_type
    )
    
    return {
        "overall_score": compute_match_score(candidate, job),
        "skills": {
            "match_percentage": round(skills_match_pct, 2),
            "matched": matched_skills,
            "missing": missing_skills
        },
        "experience": {
            "candidate_years": candidate.experience_years or 0,
            "required_min": job.experience_min or 0,
            "required_max": job.experience_max,
            "meets_requirement": exp_match,
            "penalty_factor": exp_penalty
        },
        "location": {
            "candidate_location": candidate.location,
            "job_location": job.location,
            "remote_type": job.remote_type,
            "is_match": loc_match,
            "penalty_factor": loc_penalty
        }
    }
