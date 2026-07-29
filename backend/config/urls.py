from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(('courses.user.routers', 'courses'), namespace='courses-api')),
    path('api/', include('courses.urls')),
    path('api/', include(('students.user.routers', 'students'), namespace='students-user-api')),
    path('api/', include(('students.urls', 'students'), namespace='students-api')),
]