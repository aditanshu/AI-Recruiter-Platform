from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# ============================================================================
# USER SCHEMAS
# ============================================================================

class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., pattern="^(candidate|recruiter|admin)$")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response (excludes password)."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============================================================================
# CANDIDATE SCHEMAS
# ============================================================================

class CandidateBase(BaseModel):
    """Base candidate schema."""
    headline: Optional[str] = Field(None, max_length=500)
    experience_years: int = Field(default=0, ge=0, le=50)
    location: Optional[str] = Field(None, max_length=255)
    skills_text: Optional[str] = None
    phone: Optional[str] = Field(None, max_length=20)
    linkedin_url: Optional[str] = Field(None, max_length=500)
    github_url: Optional[str] = Field(None, max_length=500)


class CandidateCreate(CandidateBase):
    """Schema for creating a candidate profile."""
    pass


class CandidateUpdate(BaseModel):
    """Schema for updating candidate profile (all fields optional)."""
    headline: Optional[str] = Field(None, max_length=500)
    experience_years: Optional[int] = Field(None, ge=0, le=50)
    location: Optional[str] = Field(None, max_length=255)
    skills_text: Optional[str] = None
    phone: Optional[str] = Field(None, max_length=20)
    linkedin_url: Optional[str] = Field(None, max_length=500)
    github_url: Optional[str] = Field(None, max_length=500)
    resume_url: Optional[str] = None


class CandidateResponse(CandidateBase):
    """Schema for candidate response."""
    id: UUID
    user_id: UUID
    resume_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# COMPANY SCHEMAS
# ============================================================================

class CompanyBase(BaseModel):
    """Base company schema."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    website: Optional[str] = Field(None, max_length=500)
    industry: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)


class CompanyCreate(CompanyBase):
    """Schema for creating a company."""
    pass


class CompanyUpdate(BaseModel):
    """Schema for updating a company (all fields optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    website: Optional[str] = Field(None, max_length=500)
    logo_url: Optional[str] = None
    industry: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)


class CompanyResponse(CompanyBase):
    """Schema for company response."""
    id: UUID
    logo_url: Optional[str] = None
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# JOB SCHEMAS
# ============================================================================

class JobBase(BaseModel):
    """Base job schema."""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=10)
    location: Optional[str] = Field(None, max_length=255)
    remote_type: str = Field(default="on-site", pattern="^(on-site|remote|hybrid)$")
    employment_type: str = Field(default="full-time", pattern="^(full-time|part-time|contract|internship)$")
    skills_required: Optional[str] = None
    salary_min: Optional[float] = Field(None, ge=0)
    salary_max: Optional[float] = Field(None, ge=0)
    currency: str = Field(default="USD", max_length=10)
    experience_min: int = Field(default=0, ge=0)
    experience_max: Optional[int] = Field(None, ge=0)


class JobCreate(JobBase):
    """Schema for creating a job."""
    company_id: UUID
    status: str = Field(default="draft", pattern="^(draft|published|closed)$")


class JobUpdate(BaseModel):
    """Schema for updating a job (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    location: Optional[str] = Field(None, max_length=255)
    remote_type: Optional[str] = Field(None, pattern="^(on-site|remote|hybrid)$")
    employment_type: Optional[str] = Field(None, pattern="^(full-time|part-time|contract|internship)$")
    skills_required: Optional[str] = None
    salary_min: Optional[float] = Field(None, ge=0)
    salary_max: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=10)
    experience_min: Optional[int] = Field(None, ge=0)
    experience_max: Optional[int] = Field(None, ge=0)
    status: Optional[str] = Field(None, pattern="^(draft|published|closed)$")


class JobResponse(JobBase):
    """Schema for job response."""
    id: UUID
    company_id: UUID
    status: str
    posted_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    company: Optional[CompanyResponse] = None
    
    class Config:
        from_attributes = True


# ============================================================================
# APPLICATION SCHEMAS
# ============================================================================

class ApplicationBase(BaseModel):
    """Base application schema."""
    cover_letter: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    """Schema for creating an application."""
    job_id: UUID


class ApplicationUpdate(BaseModel):
    """Schema for updating an application."""
    status: Optional[str] = Field(None, pattern="^(applied|screening|shortlisted|interview|rejected|offer|accepted|declined)$")
    notes: Optional[str] = None


class ApplicationResponse(ApplicationBase):
    """Schema for application response."""
    id: UUID
    job_id: UUID
    candidate_id: UUID
    status: str
    match_score: float
    screening_score: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    job: Optional[JobResponse] = None
    candidate: Optional[CandidateResponse] = None
    
    class Config:
        from_attributes = True


# ============================================================================
# SCREENING ANSWER SCHEMAS
# ============================================================================

class ScreeningAnswerBase(BaseModel):
    """Base screening answer schema."""
    question_text: str
    answer_text: str


class ScreeningAnswerCreate(ScreeningAnswerBase):
    """Schema for creating a screening answer."""
    application_id: UUID


class ScreeningAnswerResponse(ScreeningAnswerBase):
    """Schema for screening answer response."""
    id: UUID
    application_id: UUID
    ai_score: Optional[float] = None
    keywords_matched: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# INTERVIEW SCHEMAS
# ============================================================================

class InterviewBase(BaseModel):
    """Base interview schema."""
    scheduled_at: datetime
    duration_minutes: int = Field(default=60, ge=15, le=480)
    meeting_link: Optional[str] = None
    interview_type: str = Field(default="technical", pattern="^(screening|technical|behavioral|final)$")
    notes: Optional[str] = None


class InterviewCreate(InterviewBase):
    """Schema for creating an interview."""
    application_id: UUID


class InterviewUpdate(BaseModel):
    """Schema for updating an interview."""
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(None, ge=15, le=480)
    meeting_link: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(scheduled|completed|cancelled|rescheduled)$")
    notes: Optional[str] = None
    feedback: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)


class InterviewResponse(InterviewBase):
    """Schema for interview response."""
    id: UUID
    application_id: UUID
    interviewer_id: Optional[UUID] = None
    status: str
    feedback: Optional[str] = None
    rating: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# ML SCHEMAS
# ============================================================================

class ResumeParseResponse(BaseModel):
    """Schema for resume parsing response."""
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    experience_years: int = 0
    education_text: Optional[str] = None


class MatchScoreRequest(BaseModel):
    """Schema for match score calculation request."""
    job_id: UUID
    candidate_id: UUID


class MatchScoreResponse(BaseModel):
    """Schema for match score response."""
    match_score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    experience_match: bool
    location_match: bool


class ScreeningScoreRequest(BaseModel):
    """Schema for screening score calculation request."""
    application_id: UUID


class ScreeningScoreResponse(BaseModel):
    """Schema for screening score response."""
    overall_score: float
    answer_scores: List[dict]
