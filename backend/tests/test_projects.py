def test_create_project_requires_auth(client):
    response = client.post("/api/v1/projects", json={"name": "No Auth Project"})
    assert response.status_code == 401


def test_create_and_list_projects(client, auth_headers):
    response = client.post(
        "/api/v1/projects",
        json={"name": "Website Revamp", "description": "Redesign marketing site"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    project = response.json()
    assert project["name"] == "Website Revamp"

    response = client.get("/api/v1/projects", headers=auth_headers)
    assert response.status_code == 200
    projects = response.json()
    assert len(projects) == 1
    assert projects[0]["task_count"] == 0


def test_update_project(client, auth_headers):
    create_resp = client.post(
        "/api/v1/projects", json={"name": "Original"}, headers=auth_headers
    )
    project_id = create_resp.json()["id"]

    update_resp = client.put(
        f"/api/v1/projects/{project_id}",
        json={"name": "Renamed"},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "Renamed"


def test_delete_project(client, auth_headers):
    create_resp = client.post(
        "/api/v1/projects", json={"name": "Temp Project"}, headers=auth_headers
    )
    project_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert delete_resp.status_code == 204

    get_resp = client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert get_resp.status_code == 404


def test_project_not_found(client, auth_headers):
    response = client.get("/api/v1/projects/9999", headers=auth_headers)
    assert response.status_code == 404
