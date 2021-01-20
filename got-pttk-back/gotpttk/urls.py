"""gotpttk URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from rest_framework.documentation import include_docs_urls
from core import views

urlpatterns = [
    path('', include_docs_urls(title="GOT PTTK API")),
    path('admin/', admin.site.urls),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    path('api/role/', views.RoleView.as_view(), name='role'),
    path('api/segments/', views.SegmentsList.as_view(), name='segments'),
    path('api/segments/<int:pk>/', views.SegmentsDetail.as_view(), name='segment_detail'),
    path('api/user_segments/', views.UserSegmentsView.as_view(), name='user_segments'),
    path('api/route/', views.RouteView.as_view(), name='route'),
    path('api/points/', views.PointView.as_view(), name='points'),
]
