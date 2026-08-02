from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter,SimpleRouter

router = SimpleRouter()

router.register("students", views.StudentViewSet, basename="student")
urlpatterns = router.urls