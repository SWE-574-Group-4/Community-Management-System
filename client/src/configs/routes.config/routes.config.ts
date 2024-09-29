import { lazy } from 'react'
import authRoute from './authRoute'
import appsRoute from './appsRoute'
import type { Routes } from '@/@types/routes'
import i18n from 'i18next'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'singleMenuItem',
        path: '/single-menu-view',
        component: lazy(() => import('@/views/demo/SingleMenuView')),
        authority: [],
    },
    {
        key: 'addCommunity',
        path: '/create-community',
        component: lazy(() => import('@/views/community/CreateCommunity')),
        authority: [],
        meta: {
            header: i18n.t('nav.createCommunity'),
            headerContainer: true,
        },
    },
    {
        key: 'communityDetail',
        path: '/community-detail/:id',
        component: lazy(() => import('@/views/community/CommunityDetail')),
        authority: [],
        meta: {
            header: i18n.t('nav.communityDetail'),
            headerContainer: true,
        },
    },
    {
        key: 'search',
        path: '/search',
        component: lazy(() => import('@/views/search/Search')),
        authority: [],
        meta: {
            header: i18n.t('nav.search'),
            headerContainer: true,
        },
    },
    {
        key: 'post',
        path: '/post/:id',
        component: lazy(() => import('@/views/post/PostView')),
        authority: [],
        meta: {
            header: i18n.t('nav.post'),
            headerContainer: true,
        },
    },
    {
        key: 'post',
        path: '/profile/:id',
        component: lazy(() => import('@/views/profile/Profile')),
        authority: [],
        meta: {
            header: i18n.t('User Profile'),
            headerContainer: true,
        },
    },
    // {
    //     key: 'community',
    //     path: '/community-detail/:id',
    //     component: lazy(() => import('@/views/community/CommunityDetail')),
    //     authority: [],
    //     meta: {
    //         header: i18n.t('nav.communityDetail'),
    //         headerContainer: true,
    //     },
    // },

    {
        key: 'appsAccount.settings',
        path: `community/:id/:tab`,
        component: lazy(() => import('@/views/community/CommunityDetail')),
        meta: {
            header: i18n.t('nav.communityDetail'),
            headerContainer: true,
        },
    },
    {
        key: 'edit-community',
        path: `community/:id/edit`,
        component: lazy(() => import('@/views/community/CreateCommunity')),
        meta: {
            header: i18n.t('Edit Community'),
            headerContainer: true,
        },
    },
    {
        key: 'post',
        path: `community/:id/post`,
        component: lazy(() => import('@/views/post/Post')),
        meta: {
            header: i18n.t('nav.post'),
            headerContainer: true,
        },
    },
    {
        key: 'communities',
        path: '/communities',
        component: lazy(() => import('@/views/community/Communities')),
        authority: [],
        meta: {
            header: 'Communities',
            headerContainer: true,
        },
    },
    {
        key: 'collapseMenu.item1',
        path: '/collapse-menu-item-view-1',
        component: lazy(() => import('@/views/demo/CollapseMenuItemView1')),
        authority: [],
    },
    {
        key: 'collapseMenu.item2',
        path: '/collapse-menu-item-view-2',
        component: lazy(() => import('@/views/demo/CollapseMenuItemView2')),
        authority: [],
    },
    {
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        component: lazy(() => import('@/views/demo/GroupSingleMenuItemView')),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-collapse-menu-item-view-1',
        component: lazy(
            () => import('@/views/demo/GroupCollapseMenuItemView1')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        component: lazy(
            () => import('@/views/demo/GroupCollapseMenuItemView2')
        ),
        authority: [],
    },
    ...appsRoute,
]
