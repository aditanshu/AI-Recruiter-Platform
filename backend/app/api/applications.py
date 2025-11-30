from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.models import Application, Job, Candidate, User
from app.schemas import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from app.api.auth import get_current_user, require_role
from app.ml.matcher import compute_match_score

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    """
    Apply to a job (candidate only).
    
    Automatically calculates match score based on candidate profile and job requirements.
    """
    # Get candidate profile
    candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found. Please complete your profile first."
        )
    
    # Verify job exists and is published
    job = db.query(Job).filter(Job.id == application_data.job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot apply to a job that is not published"
        )
    
    # Check if already applied
    existing_application = db.query(Application).filter(
        Application.job_id == application_data.job_id,
        Application.candidate_id == candidate.id
    ).first()
    
    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )
    
    # Calculate match score
    match_score = compute_match_score(candidate, job)
    
    # Create application
    new_application = Application(
        job_id=application_data.job_id,
        candidate_id=candidate.id,
        cover_letter=application_data.cover_letter,
        match_score=match_score,
        status="applied"
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return new_application


@router.get("/my", response_model=List[ApplicationResponse])
def get_my_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    """
    Get all applications for the current candidate.
    
    Returns applications with job details and match scores.
    """
    # Get candidate profile
    candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )
    
    query = db.query(Application).filter(Application.candidate_id == candidate.id)
    
    if status:
        query = query.filter(Application.status == status)
    
    applications = query.order_by(Application.created_at.desc()).offset(skip).limit(limit).all()
    
    # Load relationships
    for app in applications:
        app.job
        app.job.company
    
    return applications


@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def get_job_applications(
    job_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    sort_by: str = Query("match_score", pattern="^(match_score|created_at)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter"))
):
    """
    Get all applications for a specific job (recruiter only).
    
    Returns applications sorted by match score (default) or date.
    """
    # Verify job exists and user has access
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.posted_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view applications for jobs you posted"
        )
    
    query = db.query(Application).filter(Application.job_id == job_id)
    
    if status:
        query = query.filter(Application.status == status)
    
    # Sort by match score (descending) or created_at
    if sort_by == "match_score":
        query = query.order_by(Application.match_score.desc())
    else:
        query = query.order_by(Application.created_at.desc())
    
    applications = query.offset(skip).limit(limit).all()
    
    # Load candidate relationships
    for app in applications:
        app.candidate
        app.candidate.user
    
    return applications


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific application by ID.
    
    Candidates can only view their own applications.
    Recruiters can view applications for their jobs.
    """
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check access permissions
    if current_user.role == "candidate":
        candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
        if not candidate or application.candidate_id != candidate.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own applications"
            )
    elif current_user.role == "recruiter":
        job = db.query(Job).filter(Job.id == application.job_id).first()
        if not job or job.posted_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view applications for jobs you posted"
            )
    
    return application


@router.patch("/{application_id}", response_model=ApplicationResponse)
def update_application_status(
    application_id: UUID,
    application_data: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter"))
):
    """
    Update application status (recruiter only).
    
    Allows recruiters to move candidates through the hiring pipeline.
    """
    application = db.query(Application).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Verify recruiter has access to this application
    job = db.query(Job).filter(Job.id == application.job_id).first()
    if not job or job.posted_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update applications for jobs you posted"
        )
    
    # Update fields
    update_data = application_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)
    
    db.commit()
    db.refresh(application)
    
    return application
