from rest_framework.routers import SimpleRouter
from .viewsets import GasStationViewSet, CarViewSet

router = SimpleRouter()
router.register(r"stations", GasStationViewSet, basename="gasstation"),
router.register(r"cars", CarViewSet, basename="cars")

urlpatterns = router.urls


