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
from .views import follow_user, unfollow_user
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', views.user_list, name='user_list'),
    path('users/<int:id>/', views.user_detail, name='user-detail'),
    path('user/<int:user_id>/invitations/', views.invitations, name='invitations'),
    path('user/<int:invitation_id>/accept_reject_invitation/', views.accept_reject_invitation, name='accept_reject_invitation'),
    path('user/communities/', views.user_communities, name='user_communities'),
    path('user/<int:user_id>/badges/', views.get_user_badges, name='user_badges'),
    path('user/notifications/', views.get_user_notifications, name='user_notifications'),
    path('user/<int:user_id>/assign-badge/<int:badge_id>/', views.assign_badge_to_user, name='assign_badge_to_user'),
    path('signup/', views.signup),
    path('login/', views.login),
    path('follow/<int:user_id>/<int:follower_id>', follow_user, name='follow_user'),
    path('unfollow/<int:user_id>/<int:follower_id>', unfollow_user, name='unfollow_user'),
    path('is_following/<int:user_id>/<int:follower_id>', views.is_following, name='is_following'),
    path('followers/<int:user_id>/', views.get_followers, name='get_followers'),
    path('following/<int:user_id>/', views.get_following, name='get_following'),
    path('api/wikidata-search', views.wikidata_search_view, name='wikidata_search'),
    path('api/save-tag', views.save_tag_view, name='save_tag'),
    path('api/recommendations/', views.recommended_posts_view, name='recommended_posts'),
    path('interests/<int:user_id>/', views.user_interests, name='user_interests'),
    path('fetch-related/<str:qid>/<str:source>/', views.fetch_and_store_related_entities, name='fetch_related_entities'),


    # other paths...
    
    # community
    path('communities/', views.communities, name='communities'),
    path('community/<int:id>/', views.community_detail, name='community-detail'),
    path('add_community/', views.add_community, name='add_community'),
    path('templates/', views.templates, name='templates'),
    path('template/<int:id>/', views.template_detail, name='template-detail'),
    path('add_template/', views.add_template, name='add_template'),
    path('default_template/', views.default_template, name='default_template'),
    path('template/<int:template_id>/delete/', views.delete_template, name='delete_template'),
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
    path('community/<int:community_id>/setCommunityBadges/', views.set_community_badges, name='set_community_badges'),
    path('community/<int:community_id>/getCommunityBadges/', views.get_community_badges, name='get_community_badges'),
    path('user/<int:user_id>/community/<int:community_id>/getUserCommunityBadges/', views.get_user_community_badges, name='get_user_community_badges'),
    path('user/<int:user_id>/getAllUserCommunityBadges/', views.get_all_user_community_badges, name='get_all_user_community_badges'),
    
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
    path('tags/', views.get_tags, name='get_tags'),
    path('enumerated_options/', views.fetch_enumerated_options, name='fetch-enumerated-options'),
    path('get_keywords/', views.fetch_keywords, name='get_keywords'),

    # search
    path('advance_search/', views.advance_search, name='advance-search'),

    # reports within a community
    path('community/<int:community_id>/create_report/', views.report_create, name='report-create'),
    path('community/<int:community_id>/reports/', views.report_list, name='community-report-list'),
    path('community/<int:community_id>/reports/<int:id>/', views.report_detail, name='community-report-detail'),
    path('community/<int:community_id>/reports/<int:id>/delete/', views.report_delete, name='report-delete'),
    path('community/<int:community_id>/reports/<int:report_id>/update_status/', views.update_report_status, name='update-report-status'),
]

static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
