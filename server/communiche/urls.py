"""
URL configuration for communiche project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from communiche import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', views.user_list, name='user_list'),
    path('users/<int:id>/', views.user_detail, name='user-detail'),
    path('user/<int:user_id>/invitations/', views.invitations, name='invitations'),
    path('user/<int:invitation_id>/accept_reject_invitation/', views.accept_reject_invitation, name='accept_reject_invitation'),
    path('user/communities/', views.user_communities, name='user_communities'),
    path('signup/', views.signup),
    path('login/', views.login),

    # community
    path('communities/', views.communities, name='communities'),
    path('community/<int:id>/', views.community_detail, name='community-detail'),
    path('add_community/', views.add_community, name='add_community'),
    path('templates/', views.templates, name='templates'),
    path('template/<int:id>/', views.template_detail, name='template-detail'),
    path('add_template/', views.add_template, name='add_template'),
    path('default_template/', views.default_template, name='default_template'),
    path('data_types/', views.data_types, name='data_types'),
    path('join_community/<int:community_id>/<int:user_id>/', views.join_community, name='join_community'),
    path('leave_community/<int:community_id>/<int:user_id>/', views.leave_community, name='leave_community'),
    path('is_user_in_community/<int:community_id>/<int:user_id>/', views.is_user_in_community),
    path('community/<int:community_id>/role/', views.user_role, name='user-role'),
    path('change_user_role/<int:community_id>/<int:user_id>/', views.change_user_role, name='change_user_role'),
    path('community/<int:community_id>/members', views.community_members, name='community-members'),
    path('community/<int:community_id>/non_members', views.community_non_members, name='community-members'),
    path('community/<int:community_id>/invites/<int:user_id>/', views.send_invitation, name='send_invitation'),
    path('community/<int:community_id>/invited/<int:user_id>/', views.check_invitation, name='chek_invitation'),
    path('logout/', views.logout, name='logout'),
    path('community/<int:community_id>/join_requests/', views.join_requests, name='join_requests'),
    path('community/<int:request_id>/accept_reject_join_request/', views.accept_reject_join_request, name='accept_join_request'),
    path('community/<int:community_id>/templates/', views.community_templates, name='community-templates'),
    path('community/<int:community_id>/posts/', views.community_posts, name='community-posts'),
    path('community/<int:community_id>/add_template/', views.add_template, name='community-add-template'),
    path('search/', views.search, name='search'),
    path('community/<int:community_id>/transfer_ownership/<int:owner_id>/<int:new_owner_id>', views.transfer_ownership, name='transfer_ownership'),

    # post
    path('post/', views.post, name='post'),
    path('post/<int:post_id>/delete/', views.delete_post, name='delete-post'),
    path('post/<int:post_id>/', views.post_detail, name='post-detail'),
    path('post/<int:post_id>/remove', views.remove_post, name='remove-post'),
    path('user/<int:user_id>/likes/<int:post_id>', views.like_post, name='like-post'),
    path('posts/', views.posts, name='posts'),
    path('post/<int:post_id>/comment/', views.comment, name='comment'),
    path('comment/<int:comment_id>/remove', views.remove_comment, name='remove-comment'),
    path('comment/<int:comment_id>/edit', views.edit_comment, name='edit-comment'),
    path('post/<int:post_id>/comments', views.comments, name='comments'),

    # search
    path('advance_search/', views.advance_search, name='advance-search'),
]
