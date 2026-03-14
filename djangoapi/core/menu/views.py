import json
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, serializers
from drf_yasg.utils import swagger_auto_schema
from core.menu.models import Menu, Cart
from rest_framework_simplejwt.authentication import JWTAuthentication


class CartItemSerializer(serializers.Serializer):
    dish_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


# ✅ Menu endpoint
@api_view(['GET'])
@authentication_classes([JWTAuthentication])   # enforce JWT if you want auth
@permission_classes([IsAuthenticated])
def get_menu(request):
    """Return the menu items."""
    menu = Menu.objects.first()
    if not menu:
        return Response([], status=status.HTTP_200_OK)

    items = menu.items if isinstance(menu.items, list) else json.loads(menu.items)
    return Response(items, status=status.HTTP_200_OK)


# ✅ Cart endpoints
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_cart(request):
    """Return the authenticated user's cart contents."""
    cart, _ = Cart.objects.get_or_create(user=request.user, defaults={"items": []})
    items = cart.items if isinstance(cart.items, list) else json.loads(cart.items)
    return Response(items, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method="post",
    request_body=CartItemSerializer,
    responses={201: CartItemSerializer}
)
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    print("DEBUG user:", request.user, getattr(request.user, "id", None), request.user.is_authenticated)

    serializer = CartItemSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    dish_id = serializer.validated_data["dish_id"]
    quantity = serializer.validated_data["quantity"]

    menu = Menu.objects.first()
    if not menu:
        return Response({"error": "Menu not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        items = menu.items if isinstance(menu.items, list) else json.loads(menu.items)
    except (TypeError, json.JSONDecodeError):
        return Response({"error": "Invalid menu data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    dish = next((item for item in items if item.get("id") == dish_id), None)
    if not dish:
        return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)

    cart, _ = Cart.objects.get_or_create(user=request.user, defaults={"items": []})
    cart_items = cart.items if isinstance(cart.items, list) else json.loads(cart.items)

    cart_items.append({
        "id": dish["id"],
        "name": dish["name"],
        "price": dish["price"],
        "quantity": quantity,
    })

    cart.items = cart_items
    cart.save()

    return Response(cart.items, status=status.HTTP_201_CREATED)