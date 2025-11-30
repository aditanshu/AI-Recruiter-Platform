from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import Candidate, User
from app.schemas import CandidateCreate, CandidateUpdate, CandidateResponse
from app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/candidates", tags=["Candidates"])


@router.get("/me", response_model=CandidateResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    """
    Get current candidate's profile.
    """
    candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )
    
    return candidate


@router.post("/me", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
def create_my_profile(
    candidate_data: CandidateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    """
    Create candidate profile (candidate only).
    
    This is usually created automatically during signup, but can be
    created manually if needed.
    """
    # Check if profile already exists
    existing_candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
    if existing_candidate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile already exists. Use PATCH to update."
        )
    
    # Create candidate profile
    new_candidate = Candidate(
        **candidate_data.dict(),
        user_id=current_user.id
    )
    
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)
    
    return new_candidate


@router.patch("/me", response_model=CandidateResponse)
def update_my_profile(
    candidate_data: CandidateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    """
    Update current candidate's profile.
    """
    candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found. Create one first."
        )
    
    # Update only provided fields
    update_data = candidate_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(candidate, field, value)
    
    db.commit()
    db.refresh(candidate)
    
    return candidate


@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(
    candidate_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific candidate's profile.
    
    Recruiters can view candidate profiles.
    Candidates can only view their own profile.
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    # Check permissions
    if current_user.role == "candidate":
        if candidate.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own profile"
            )
    
    return candidate
