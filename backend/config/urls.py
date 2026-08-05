from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse

# API root view
@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    return Response({
        'auth': {
            'login':    reverse('courses-api:auth-login-list',    request=request),
            'register': reverse('courses-api:auth-register-list', request=request),
            'refresh':  reverse('courses-api:auth-refresh-list',  request=request),
        },
        'users':    reverse('courses-api:user-list', request=request),
        'courses':  reverse('course-list',           request=request),
        'students': reverse('students-api:student-list', request=request),
    })

urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', api_root, name='api-root'),
    path('api/', include(('courses.user.routers', 'courses'), namespace='courses-api')),
    path('api/', include('courses.urls')),
    path('api/', include(('students.urls', 'students'), namespace='students-api')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)