from rest_framework import status
from core.fixtures.user import user
from core.fixtures.post import post
from core.fixtures.comment import comment

class TestCommentViewSet:

    # The comment resource is nested under the post resource
    endpoint = '/api/post/'

    ###############################
    # Authenticated user tests
    ###############################

    def test_list(self, client, user, post, comment):
        client.force_authenticate(user=user)
        response = client.get(f"{self.endpoint}{post.public_id}/comment/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1  # ✅ no "count", just check list length

    def test_retrieve(self, client, user, post, comment):
        client.force_authenticate(user=user)
        response = client.get(f"{self.endpoint}{post.public_id}/comment/{comment.public_id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == comment.public_id.hex
        assert response.data['body'] == comment.body
        assert response.data['author']['id'] == comment.author.public_id.hex

    def test_create(self, client, user, post):
        client.force_authenticate(user=user)
        data = {
            "body": "Test Comment Body",
            "author": user.public_id.hex,
            "post": post.public_id.hex
        }
        response = client.post(f"{self.endpoint}{post.public_id}/comment/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['body'] == data['body']
        assert response.data['author']['id'] == user.public_id.hex

    def test_update(self, client, user, post, comment):
        client.force_authenticate(user=user)
        data = {
            "body": "Test Comment Body Updated",
            "author": user.public_id.hex,
            "post": post.public_id.hex
        }
        response = client.put(f"{self.endpoint}{post.public_id}/comment/{comment.public_id}/", data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['body'] == data['body']

    def test_delete(self, client, user, post, comment):
        client.force_authenticate(user=user)
        response = client.delete(f"{self.endpoint}{post.public_id}/comment/{comment.public_id}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT

    ###############################
    # Anonymous user tests
    ###############################

    def test_list_anonymous(self, client, post, comment):
        response = client.get(f"{self.endpoint}{post.public_id}/comment/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1  # ✅ no "count"

    def test_retrieve_anonymous(self, client, post, comment):
        response = client.get(f"{self.endpoint}{post.public_id}/comment/{comment.public_id}/")
        assert response.status_code == status.HTTP_200_OK

    def test_create_anonymous(self, client, post):
        data = {}
        response = client.post(f"{self.endpoint}{post.public_id}/comment/", data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_anonymous(self, client, post, comment):
        data = {}
        response = client.put(f"{self.endpoint}{post.public_id}/comment/{comment.public_id}/", data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_anonymous(self, client, post, comment):
        response = client.delete(f"{self.endpoint}{post.public_id}/comment/{comment.public_id}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
