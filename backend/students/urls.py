from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter,SimpleRouter

router = SimpleRouter()
# register viewset with router
router.register("students", views.StudentViewSet, basename="student")
urlpatterns = router.urls

# urlpatterns = [
#     path('students/', views.StudentView.as_view(), name='students'),
#     path('students/<int:id>', views.StudentView.as_view(), name='student'),
# ]