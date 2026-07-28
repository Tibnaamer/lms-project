from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter,SimpleRouter

router = SimpleRouter()
# register viewset with router
router.register("courses", views.CourseViewSet, basename="course")
urlpatterns = router.urls

# urlpatterns = [
#     path('courses/', views.CourseView.as_view(), name='courses'),
#     path('courses/<int:id>', views.CourseView.as_view(), name='courses'),
# ]