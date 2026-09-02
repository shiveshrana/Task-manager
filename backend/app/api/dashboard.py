from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.project import Project
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.schemas.task import DashboardStats
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardStats)
def get_dashboard(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    total_projects = (
        db.query(func.count(Project.id)).filter(Project.owner_id == current_user.id).scalar()
    )

    base_task_query = db.query(Task).join(Project).filter(Project.owner_id == current_user.id)

    total_tasks = base_task_query.count()
    completed_tasks = base_task_query.filter(Task.status == TaskStatus.COMPLETED).count()
    in_progress_tasks = base_task_query.filter(Task.status == TaskStatus.IN_PROGRESS).count()
    pending_tasks = base_task_query.filter(
        Task.status.in_([TaskStatus.TODO, TaskStatus.REVIEW])
    ).count()

    recent_tasks = (
        base_task_query.options(joinedload(Task.assignee))
        .order_by(Task.created_at.desc())
        .limit(5)
        .all()
    )

    return DashboardStats(
        total_projects=total_projects,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        in_progress_tasks=in_progress_tasks,
        recent_tasks=recent_tasks,
    )
