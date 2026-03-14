class AuthorizationHeaderMiddleware:
    """
    Ensure Authorization header is available as HTTP_AUTHORIZATION.
    Some environments (especially cross-origin dev setups) may not
    populate request.META['HTTP_AUTHORIZATION'] reliably.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If Django didn't set HTTP_AUTHORIZATION, copy it from request.headers
        if not request.META.get("HTTP_AUTHORIZATION"):
            auth = request.headers.get("Authorization")
            if auth:
                request.META["HTTP_AUTHORIZATION"] = auth

        return self.get_response(request)


