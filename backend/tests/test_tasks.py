import pytest


@pytest.fixture
def project(client, auth_headers):
    response = client.post(
        "/api/v1/projects", json={"name": "Mobile App"}, headers=auth_headers
    )
    return response.json()


def test_create_task(client, auth_headers, project):
    response = client.post(
        "/api/v1/tasks",
        json={
            "title": "Design onboarding flow",
            "description": "Wireframes + hi-fi mocks",
            "priority": "HIGH",
            "project_id": project["id"],
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    task = response.json()
    assert task["status"] == "TODO"
    assert task["priority"] == "HIGH"


def test_update_task_status(client, auth_headers, project):
    create_resp = client.post(
        "/api/v1/tasks",
        json={"title": "Implement auth", "project_id": project["id"]},
        headers=auth_headers,
    )
    task_id = create_resp.json()["id"]

    update_resp = client.put(
        f"/api/v1/tasks/{task_id}",
        json={"status": "IN_PROGRESS"},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "IN_PROGRESS"


def test_assign_task_to_user(client, auth_headers, project, registered_user):
    me_resp = client.get("/api/v1/auth/me", headers=auth_headers)
    user_id = me_resp.json()["id"]

    create_resp = client.post(
        "/api/v1/tasks",
        json={
            "title": "Write API docs",
            "project_id": project["id"],
            "assignee_id": user_id,
        },
        headers=auth_headers,
    )
    assert create_resp.status_code == 201
    assert create_resp.json()["assignee"]["id"] == user_id


def test_delete_task(client, auth_headers, project):
    create_resp = client.post(
        "/api/v1/tasks",
        json={"title": "Throwaway task", "project_id": project["id"]},
        headers=auth_headers,
    )
    task_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert delete_resp.status_code == 204

    get_resp = client.get(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert get_resp.status_code == 404


def test_list_tasks_filtered_by_project(client, auth_headers, project):
    client.post(
        "/api/v1/tasks",
        json={"title": "Task A", "project_id": project["id"]},
        headers=auth_headers,
    )
    response = client.get(
        f"/api/v1/tasks?project_id={project['id']}", headers=auth_headers
    )
    assert response.status_code == 200
    assert len(response.json()) == 1
