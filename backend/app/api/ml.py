from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import Application, ScreeningAnswer
from app.schemas import ResumeParseResponse, ScreeningScoreRequest, ScreeningScoreResponse
from app.api.auth import get_current_user, User
from app.ml.resume_parser import parse_resume
from app.ml.screening import score_answer_auto, calculate_overall_screening_score

router = APIRouter(prefix="/ml", tags=["ML/AI"])


@router.post("/parse-resume", response_model=ResumeParseResponse)
async def parse_resume_endpoint(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Parse a resume file and extract structured information.
    
    Accepts PDF or DOCX files and extracts:
    - Name, email, phone
    - Skills
    - Years of experience
    - Education information
    
    **File size limit**: 10MB
    **Supported formats**: PDF, DOCX
    """
    # Validate file size (10MB limit)
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    # Read file content
    file_content = await file.read()
    
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 10MB limit"
        )
    
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF and DOCX files are supported."
        )
    
    try:
        # Parse resume
        parsed_data = parse_resume(file_content, file.filename)
        
        return ResumeParseResponse(**parsed_data)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing resume: {str(e)}"
        )


@router.post("/score-screening", response_model=ScreeningScoreResponse)
def score_screening_answers(
    request: ScreeningScoreRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calculate AI scores for screening answers.
    
    Analyzes screening question answers using keyword matching and
    natural language processing to provide quality scores.
    
    **Requires**: Application with screening answers
    **Returns**: Overall score and individual answer scores
    """
    # Get application
    application = db.query(Application).filter(Application.id == request.application_id).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Get screening answers
    screening_answers = db.query(ScreeningAnswer).filter(
        ScreeningAnswer.application_id == request.application_id
    ).all()
    
    if not screening_answers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No screening answers found for this application"
        )
    
    # Score each answer
    answer_scores = []
    for answer in screening_answers:
        try:
            # Use automatic scoring
            score_result = score_answer_auto(answer.answer_text, answer.question_text)
            
            # Update the answer with AI score and matched keywords
            answer.ai_score = score_result["score"]
            answer.keywords_matched = score_result.get("matched_keywords", [])
            
            answer_scores.append({
                "question": answer.question_text,
                "answer": answer.answer_text,
                "score": score_result["score"],
                "matched_keywords": score_result.get("matched_keywords", []),
                "category": score_result.get("category", "general")
            })
        
        except Exception as e:
            # If scoring fails for one answer, continue with others
            answer_scores.append({
                "question": answer.question_text,
                "answer": answer.answer_text,
                "score": 0.0,
                "error": str(e)
            })
    
    # Calculate overall score
    overall_score = calculate_overall_screening_score(answer_scores)
    
    # Update application screening score
    application.screening_score = overall_score
    
    db.commit()
    
    return ScreeningScoreResponse(
        overall_score=overall_score,
        answer_scores=answer_scores
    )
