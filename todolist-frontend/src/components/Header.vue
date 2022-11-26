<template>
    <div v-if="!hide" class="container bg-primary rounded-2 p-1">
        <div class="d-flex justify-content-evenly">
            <span @click="home" style="cursor: pointer;">
                <img src="../assets/logo.svg" alt="" width="56" height="56" class="d-inline">
                <h5 class="d-inline align-middle text-light p-2">TO DO LIST</h5>
            </span>
            <button :class="{ 'active': index === 0 }" type="button" class="btn btn-primary" @click="allPlans">Kế
                hoạch</button>
            <button :class="{ 'active': index === 1 }" type="button" class="btn btn-primary" @click="allTasks">Tất cả
                công việc</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            hide: false,
            index: 0,
        }
    },
    methods: {
        allPlans() {
            this.index = 0;
            this.$router.push("/");
        },
        allTasks() {
            this.index = 1;
            this.$router.push("/Tasks");
        },
        home() {
            this.index = 0;
            this.$router.push('/');
        }
    },
    created() {
        this.allPlans();
    },
}
</script>
<style scoped>
.logo {
    width: 48px;
    height: 48px;
}
</style>