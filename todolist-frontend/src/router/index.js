import { createWebHistory, createRouter } from "vue-router";
const routes = [
    {
        path: "/",
        name: "body",
        component: () => import('@/components/Plans.vue'),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/components/NotFound.vue"),
    },
    {
        path: "/Tasks",
        name: "tasks",
        component: () => import("@/components/Tasks.vue"),
    },
    {
        path: "/Tasks/:id/edit",
        name: "task.edit",
        component: () => import("@/components/TaskEdit.vue"),
    }
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
export default router;
