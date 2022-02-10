import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        redirect: '/home',
        children: [
          {
            path: '/home',
            name: 'home',
            component: () => import('pages/home/index.vue'),
          },
          {
            path: '/blog/:id',
            name: 'blog',
            component: () => import('pages/blog/index.vue'),
            props: true,
          },
          {
            path: '/editor',
            name: 'editor',
            component: () => import('pages/blog/editor.vue'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
