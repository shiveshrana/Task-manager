from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate
from app.services.auth_service import get_current_user, get_user_by_username

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if updates.username and updates.username != current_user.username:
        existing = get_user_by_username(db, updates.username)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
            )
        current_user.username = updates.username

    if updates.full_name is not None:
        current_user.full_name = updates.full_name

    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("", response_model=list[UserOut])
def list_users(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """List all active users — used for assigning tasks."""
    return db.query(User).filter(User.is_active == True).all()  # noqa: E712
