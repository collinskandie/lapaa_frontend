import React from 'react'
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication/login')),
    },

    {
        key: 'forgot-password',
        path: `${AUTH_PREFIX_PATH}/forgot-password`,
        component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
    },
    {
        key: 'error-page-1',
        path: `${AUTH_PREFIX_PATH}/error-page-1`,
        component: React.lazy(() => import('views/auth-views/errors/error-page-1')),
    },
    {
        key: 'error-page-2',
        path: `${AUTH_PREFIX_PATH}/error-page-2`,
        component: React.lazy(() => import('views/auth-views/errors/error-page-2')),
    },
]

export const protectedRoutes = [

    {
        key: 'dashboard.analytic',
        path: `${APP_PREFIX_PATH}/dashboards`,
        component: React.lazy(() => import('views/app-views/dashboards')),
    },
    {
        key: 'apps',
        path: `${APP_PREFIX_PATH}/apps`,
        component: React.lazy(() => import('views/app-views/apps')),
    },
    {
        key: 'apps.youth.list',
        path: `${APP_PREFIX_PATH}/apps/youth/list`,
        component: React.lazy(() => import('views/app-views/apps/youth')),
    },
    {
        key: 'apps.companies.list',
        path: `${APP_PREFIX_PATH}/apps/companies/list`,
        component: React.lazy(() => import('views/app-views/apps/company')),
    },
    {
        key: 'apps.youth.register',
        path: `${APP_PREFIX_PATH}/apps/youth/register`,
        component: React.lazy(() => import('views/app-views/apps/youth/register')),
    },
    {
        key: 'apps.chat',
        path: `${APP_PREFIX_PATH}/apps/youth/list`,
        component: React.lazy(() => import('views/app-views/apps/chat')),
    },
    {
        key: 'apps.calendar',
        path: `${APP_PREFIX_PATH}/apps/calendar`,
        component: React.lazy(() => import('views/app-views/apps/calendar')),
    },
    {
        key: "systemusers",
        path: `${APP_PREFIX_PATH}/users/list`,
        component: React.lazy(() => import("views/app-views/user/list")),
    },
    {
        key: "rolemanagement",
        path: `${APP_PREFIX_PATH}/users/roles`,
        component: React.lazy(() => import("views/app-views/user/role")),
    },
    {
        key: "userprofile",
        path: `${APP_PREFIX_PATH}/user/userprofile`,
        component: React.lazy(() => import("views/app-views/user/profile")),
    },
]