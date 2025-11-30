from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.models import Company, User
from app.schemas import CompanyCreate, CompanyUpdate, CompanyResponse
from app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.get("", response_model=List[CompanyResponse])
def get_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    name: Optional[str] = None,
    industry: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get list of companies with optional filtering.
    
    - **skip**: Number of companies to skip (pagination)
    - **limit**: Maximum number of companies to return
    - **name**: Filter by company name (partial match)
    - **industry**: Filter by industry
    """
    query = db.query(Company)
    
    if name:
        query = query.filter(Company.name.ilike(f"%{name}%"))
    
    if industry:
        query = query.filter(Company.industry.ilike(f"%{industry}%"))
    
    companies = query.order_by(Company.created_at.desc()).offset(skip).limit(limit).all()
    
    return companies


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: UUID, db: Session = Depends(get_db)):
    """
    Get a specific company by ID.
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    return company


@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter"))
):
    """
    Create a new company (recruiter only).
    """
    # Check if company name already exists
    existing_company = db.query(Company).filter(Company.name == company_data.name).first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A company with this name already exists"
        )
    
    # Create company
    new_company = Company(
        **company_data.dict(),
        created_by=current_user.id
    )
    
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return new_company


@router.patch("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: UUID,
    company_data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter"))
):
    """
    Update a company (recruiter only).
    
    Only the recruiter who created the company can update it.
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Verify user created this company
    if company.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update companies you created"
        )
    
    # Update only provided fields
    update_data = company_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)
    
    db.commit()
    db.refresh(company)
    
    return company


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(
    company_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter"))
):
    """
    Delete a company (recruiter only).
    
    Only the recruiter who created the company can delete it.
    Warning: This will also delete all associated jobs and applications.
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Verify user created this company
    if company.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete companies you created"
        )
    
    db.delete(company)
    db.commit()
    
    return None
