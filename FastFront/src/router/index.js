import { createRouter, createWebHistory } from 'vue-router'
import CompponentListProject from '@/components/CompponentListProject.vue'
import ComponentStatusTodos from '@/components/ComponentStatusTodos.vue'

const routes = [
  {
    path: '/',
    name: 'ListProject',
    component: CompponentListProject,
  },
  {
    path: '/projects/:id',
    name: 'ProjectTodos',
    component: ComponentStatusTodos,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
