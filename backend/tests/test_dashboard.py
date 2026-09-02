def test_dashboard_empty_state(client, auth_headers):
    response = client.get("/api/v1/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_projects"] == 0
    assert data["total_tasks"] == 0


def test_dashboard_reflects_created_data(client, auth_headers):
    project_resp = client.post(
        "/api/v1/projects", json={"name": "Q3 Launch"}, headers=auth_headers
    )
    project_id = project_resp.json()["id"]

    client.post(
        "/api/v1/tasks",
        json={"title": "Task 1", "project_id": project_id, "status": "COMPLETED"},
        headers=auth_headers,
    )
    client.post(
        "/api/v1/tasks",
        json={"title": "Task 2", "project_id": project_id, "status": "IN_PROGRESS"},
        headers=auth_headers,
    )
    client.post(
        "/api/v1/tasks",
        json={"title": "Task 3", "project_id": project_id, "status": "TODO"},
        headers=auth_headers,
    )

    response = client.get("/api/v1/dashboard", headers=auth_headers)
    data = response.json()
    assert data["total_projects"] == 1
    assert data["total_tasks"] == 3
    assert data["completed_tasks"] == 1
    assert data["in_progress_tasks"] == 1
    assert data["pending_tasks"] == 1
    assert len(data["recent_tasks"]) == 3
