from sqlalchemy import Column, String, Integer, Numeric, Text, ForeignKey, TIMESTAMP, CheckConstraint, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class User(Base):
    """User model for authentication and role management."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, index=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        CheckConstraint("role IN ('candidate', 'recruiter', 'admin')", name="check_user_role"),
    )
    
    # Relationships
    candidate = relationship("Candidate", back_populates="user", uselist=False, cascade="all, delete-orphan")
    companies_created = relationship("Company", back_populates="creator")
    jobs_posted = relationship("Job", back_populates="poster")


class Candidate(Base):
    """Candidate profile with skills and experience."""
    __tablename__ = "candidates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    headline = Column(String(500))
    experience_years = Column(Integer, default=0)
    location = Column(String(255), index=True)
    skills_text = Column(Text)  # Comma-separated skills
    resume_url = Column(Text)
    phone = Column(String(20))
    linkedin_url = Column(String(500))
    github_url = Column(String(500))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="candidate")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")


class Company(Base):
    """Company profiles created by recruiters."""
    __tablename__ = "companies"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    website = Column(String(500))
    logo_url = Column(Text)
    industry = Column(String(100))
    size = Column(String(50))
    location = Column(String(255))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", back_populates="companies_created")
    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")


class Job(Base):
    """Job postings with requirements and details."""
    __tablename__ = "jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), index=True)
    remote_type = Column(String(50), default="on-site")
    employment_type = Column(String(50), default="full-time")
    skills_required = Column(Text)  # Comma-separated skills
    salary_min = Column(Numeric(12, 2))
    salary_max = Column(Numeric(12, 2))
    currency = Column(String(10), default="USD")
    experience_min = Column(Integer, default=0)
    experience_max = Column(Integer)
    status = Column(String(20), default="draft", index=True)
    posted_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        CheckConstraint("remote_type IN ('on-site', 'remote', 'hybrid')", name="check_remote_type"),
        CheckConstraint("employment_type IN ('full-time', 'part-time', 'contract', 'internship')", name="check_employment_type"),
        CheckConstraint("status IN ('draft', 'published', 'closed')", name="check_job_status"),
    )
    
    # Relationships
    company = relationship("Company", back_populates="jobs")
    poster = relationship("User", back_populates="jobs_posted")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")


class Application(Base):
    """Job applications with AI match scores."""
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="applied", index=True)
    match_score = Column(Numeric(5, 2), default=0.0, index=True)
    screening_score = Column(Numeric(5, 2))
    cover_letter = Column(Text)
    notes = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        CheckConstraint("status IN ('applied', 'screening', 'shortlisted', 'interview', 'rejected', 'offer', 'accepted', 'declined')", name="check_application_status"),
    )
    
    # Relationships
    job = relationship("Job", back_populates="applications")
    candidate = relationship("Candidate", back_populates="applications")
    screening_answers = relationship("ScreeningAnswer", back_populates="application", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")


class ScreeningAnswer(Base):
    """Screening question responses with AI scoring."""
    __tablename__ = "screening_answers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=False)
    ai_score = Column(Numeric(5, 2))
    keywords_matched = Column(ARRAY(Text))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    # Relationships
    application = relationship("Application", back_populates="screening_answers")


class Interview(Base):
    """Interview scheduling and feedback."""
    __tablename__ = "interviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_at = Column(TIMESTAMP(timezone=True), nullable=False, index=True)
    duration_minutes = Column(Integer, default=60)
    meeting_link = Column(Text)
    interview_type = Column(String(50), default="technical")
    interviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    status = Column(String(50), default="scheduled")
    notes = Column(Text)
    feedback = Column(Text)
    rating = Column(Integer)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        CheckConstraint("interview_type IN ('screening', 'technical', 'behavioral', 'final')", name="check_interview_type"),
        CheckConstraint("status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')", name="check_interview_status"),
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),
    )
    
    # Relationships
    application = relationship("Application", back_populates="interviews")
    interviewer = relationship("User", foreign_keys=[interviewer_id])
