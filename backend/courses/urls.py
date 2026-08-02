from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter,SimpleRouter

router = SimpleRouter()

router.register("courses", views.CourseViewSet, basename="course")
urlpatterns = router.urls