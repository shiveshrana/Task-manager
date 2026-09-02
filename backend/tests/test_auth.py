def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "bob@example.com",
            "username": "bob",
            "full_name": "Bob Builder",
            "password": "buildsomething1",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "bob@example.com"
    assert "hashed_password" not in data


def test_register_duplicate_email_fails(client, registered_user):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": registered_user["email"],
            "username": "someone_else",
            "password": "anotherpassword1",
        },
    )
    assert response.status_code == 400


def test_login_success(client, registered_user):
    response = client.post(
        "/api/v1/auth/login/json",
        json={"email": registered_user["email"], "password": registered_user["password"]},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password_fails(client, registered_user):
    response = client.post(
        "/api/v1/auth/login/json",
        json={"email": registered_user["email"], "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_protected_endpoint_requires_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_protected_endpoint_with_token(client, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["username"] == "alice"
