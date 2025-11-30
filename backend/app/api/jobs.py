from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.models import Job, Company, User
from app.schemas import JobCreate, JobUpdate, JobResponse
from app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("", response_model=List[JobResponse])
def get_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, pattern="^(draft|published|closed)$"),
    location: Optional[str] = None,
    remote_type: Optional[str] = Query(None, pattern="^(on-site|remote|hybrid)$"),
    skills: Optional[str] = None,  # Comma-separated skills to search for
    title: Optional[str] = None,  # Search in job title
    db: Session = Depends(get_db)
):
    """
    Get list of jobs with optional filtering.
    
    - **skip**: Number of jobs to skip (pagination)
    - **limit**: Maximum number of jobs to return
    - **status**: Filter by job status (published jobs only by default for public)
    - **location**: Filter by location (partial match)
    - **remote_type**: Filter by remote type
    - **skills**: Comma-separated skills to search for
    - **title**: Search in job title (partial match)
    """
    query = db.query(Job)
    
    # Default to published jobs only for public access
    if status:
        query = query.filter(Job.status == status)
    else:
        query = query.filter(Job.status == "published")
    
    # Apply filters
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    
    if remote_type:
        query = query.filter(Job.remote_type == remote_type)
    
    if title:
        query = query.filter(Job.title.ilike(f"%{title}%"))
    
    if skills:
        # Search for any of the provided skills
        skill_list = [s.strip() for s in skills.split(",")]
        skill_filters = [Job.skills_required.ilike(f"%{skill}%") for skill in skill_list]
        query = query.filter(or_(*skill_filters))
    
    # Order by most recent first
    query = query.order_by(Job.created_at.desc())
    
    jobs = query.offset(skip).limit(limit).all()
    
    # Load company relationship
    for job in jobs:
        job.company  # This triggers lazy loading
    
    return jobs


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: UUID, db: Session = Depends(get_db)):
    """
    Get a specific job by ID.
    
    Returns job details including company information.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return job


@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter"))
):
    """
    Create a new job posting (recruiter only).
    
    Requires recruiter role and valid company_id.
    """
    # Verify company exists and user has access
    company = db.query(Company).filter(Company.id == job_data.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Optional: Verify user created this company
    if company.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only post jobs for companies you created"
        )
    
    # Create job
    new_job = Job(
        **job_data.dict(),
        posted_by=current_user.id
    )
    
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    return new_job


@router.patch("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: UUID,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter"))
):
    """
    Update an existing job (recruiter only).
    
    Only the recruiter who posted the job can update it.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Verify user posted this job
    if job.posted_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update jobs you posted"
        )
    
    # Update only provided fields
    update_data = job_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    
    db.commit()
    db.refresh(job)
    
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter"))
):
    """
    Delete a job (recruiter only).
    
    Only the recruiter who posted the job can delete it.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Verify user posted this job
    if job.posted_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete jobs you posted"
        )
    
    db.delete(job)
    db.commit()
    
    return None


@router.get("/company/{company_id}", response_model=List[JobResponse])
def get_company_jobs(
    company_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get all jobs for a specific company.
    
    Returns published jobs only for public access.
    """
    jobs = db.query(Job).filter(
        and_(Job.company_id == company_id, Job.status == "published")
    ).order_by(Job.created_at.desc()).offset(skip).limit(limit).all()
    
    return jobs
