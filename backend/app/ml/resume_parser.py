import re
import pdfplumber
from docx import Document
from typing import Dict, List, Optional
import io


# Predefined list of common tech skills
TECH_SKILLS = [
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "php", "swift", "kotlin",
    "go", "rust", "scala", "r", "matlab", "perl", "shell", "bash",
    
    # Web Technologies
    "html", "css", "react", "angular", "vue", "node.js", "express", "django", "flask", "fastapi",
    "spring", "asp.net", "laravel", "rails", "jquery", "bootstrap", "tailwind",
    
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "oracle",
    "sqlite", "dynamodb", "firebase",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab", "github", "terraform",
    "ansible", "ci/cd", "devops",
    
    # Data Science & ML
    "machine learning", "deep learning", "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "data analysis", "nlp", "computer vision", "ai",
    
    # Other Technologies
    "git", "linux", "agile", "scrum", "rest api", "graphql", "microservices", "testing",
    "unit testing", "integration testing", "jira", "confluence"
]


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file."""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
            return text
    except Exception as e:
        raise ValueError(f"Error extracting text from PDF: {str(e)}")


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX file."""
    try:
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        raise ValueError(f"Error extracting text from DOCX: {str(e)}")


def extract_email(text: str) -> Optional[str]:
    """Extract email address from text using regex."""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    """Extract phone number from text using regex."""
    # Matches various phone formats
    phone_patterns = [
        r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # +1-234-567-8900
        r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # (234) 567-8900
        r'\d{10}',  # 2345678900
    ]
    
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return None


def extract_skills(text: str) -> List[str]:
    """
    Extract skills from text by matching against predefined skill list.
    
    Uses case-insensitive matching and returns unique skills found.
    """
    text_lower = text.lower()
    found_skills = []
    
    for skill in TECH_SKILLS:
        # Use word boundaries to avoid partial matches
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill.title())  # Capitalize for consistency
    
    # Remove duplicates while preserving order
    return list(dict.fromkeys(found_skills))


def extract_experience_years(text: str) -> int:
    """
    Extract years of experience from text.
    
    Looks for patterns like "5 years experience", "3+ years", etc.
    """
    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience[:\s]+(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s+(?:of\s+)?experience',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return 0


def extract_name(text: str) -> Optional[str]:
    """
    Extract name from resume (simple heuristic).
    
    Assumes the first line or first capitalized words are the name.
    This is a simple implementation and may need improvement.
    """
    lines = text.strip().split('\n')
    if not lines:
        return None
    
    # Try first non-empty line
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if line and len(line) < 50:  # Names are usually short
            # Check if it looks like a name (mostly letters and spaces)
            if re.match(r'^[A-Za-z\s.]+$', line):
                return line
    
    return None


def extract_education(text: str) -> Optional[str]:
    """
    Extract education information from resume.
    
    Looks for common degree keywords and university names.
    """
    education_keywords = [
        r'bachelor', r'master', r'phd', r'doctorate', r'b\.?s\.?', r'm\.?s\.?',
        r'b\.?tech', r'm\.?tech', r'mba', r'university', r'college', r'degree'
    ]
    
    lines = text.split('\n')
    education_lines = []
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        if any(re.search(keyword, line_lower) for keyword in education_keywords):
            # Include this line and potentially the next few lines
            education_lines.append(line.strip())
            if i + 1 < len(lines):
                education_lines.append(lines[i + 1].strip())
    
    return ' '.join(education_lines[:5]) if education_lines else None  # Limit to first 5 lines


def parse_resume(file_bytes: bytes, filename: str) -> Dict:
    """
    Parse resume file and extract structured information.
    
    Args:
        file_bytes: Binary content of the resume file
        filename: Name of the file (to determine type)
        
    Returns:
        Dictionary containing extracted information:
        - name: Candidate's name
        - email: Email address
        - phone: Phone number
        - skills: List of identified skills
        - experience_years: Years of experience
        - education_text: Education information
        
    Raises:
        ValueError: If file format is not supported or parsing fails
    """
    # Determine file type and extract text
    if filename.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_bytes)
    elif filename.lower().endswith('.docx'):
        text = extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file format. Please upload PDF or DOCX files only.")
    
    if not text or len(text.strip()) < 50:
        raise ValueError("Could not extract meaningful text from resume. Please check the file.")
    
    # Extract information
    parsed_data = {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "experience_years": extract_experience_years(text),
        "education_text": extract_education(text)
    }
    
    return parsed_data
