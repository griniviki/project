from rest_framework.viewsets import ModelViewSet
from .models import GasStation
from .serializers import GasStationSerializer


class GasStationViewSet(ModelViewSet):
    queryset = GasStation.objects.all()
    serializer_class = GasStationSerializer


from rest_framework import viewsets
from .models import Car
from .serializers import CarSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer