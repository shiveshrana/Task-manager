from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.project import Project
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate, ProjectWithStats
from app.schemas.task import TaskOut
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


def _get_owned_project(db: Session, project_id: int, current_user: User) -> Project:
    project = (
        db.query(Project)
        .options(joinedload(Project.owner))
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this project",
        )
    return project


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = Project(
        name=project_in.name, description=project_in.description, owner_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("", response_model=list[ProjectWithStats])
def list_projects(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    projects = (
        db.query(Project)
        .options(joinedload(Project.owner), joinedload(Project.tasks))
        .filter(Project.owner_id == current_user.id)
        .order_by(Project.created_at.desc())
        .all()
    )
    result = []
    for p in projects:
        item = ProjectWithStats.model_validate(p)
        item.task_count = len(p.tasks)
        item.completed_task_count = sum(1 for t in p.tasks if t.status == TaskStatus.COMPLETED)
        result.append(item)
    return result


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _get_owned_project(db, project_id, current_user)


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    updates: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _get_owned_project(db, project_id, current_user)
    if updates.name is not None:
        project.name = updates.name
    if updates.description is not None:
        project.description = updates.description
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _get_owned_project(db, project_id, current_user)
    db.delete(project)
    db.commit()
    return None


@router.get("/{project_id}/tasks", response_model=list[TaskOut])
def list_project_tasks(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _get_owned_project(db, project_id, current_user)
    return (
        db.query(Task)
        .options(joinedload(Task.assignee))
        .filter(Task.project_id == project_id)
        .order_by(Task.created_at.desc())
        .all()
    )
