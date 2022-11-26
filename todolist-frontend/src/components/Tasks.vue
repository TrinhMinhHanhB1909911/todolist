
<template>
    <div v-if="tasks.length !== 0" class="container mt-3">
        <div class="col-7 d-flex justify-content-start mx-auto mb-1">
            <font-awesome-icon icon="search" class="d-inline search align-middle opacity-50" />
            <input v-model="textSearch" type="text" placeholder="Tìm kiếm" id="search"
                class="d-inline w-75 mx-auto rounded-2 border border-secondary p-2">
        </div>
        <div class="row">
            <div :class="{ 'col-12': !editing, 'col-9': editing }" class="tasks container rounded-2 p-3 px-5 mt-2">
                <h5 class="text-center text-light pb-3">
                    Công việc
                </h5>
                <template v-if="textSearch.length === 0">
                    <div v-for="task, index in tasks">
                        <div v-if="!task.completed" class="card mt-2">
                            <div class="align-middle text-dark p-3 mx-3 d-flex">
                                <span class="align-middle"><input type="checkbox" class="checkbox align-middle"
                                        @click="setCompletedTask(task._id, index)" /></span>
                                <span>&nbsp;&nbsp;&nbsp;{{ task.title }} ({{ plans.filter((plan) => plan._id ===
                                        task.planId)[0].title
                                }})</span>
                                <span class="star align-middle">
                                    <font-awesome-icon :class="{ 'text-warning': task.isImportant }" icon="star"
                                        class="btn ms-auto px-3" @click.stop="setImportantTask(task._id, index)" />
                                    <font-awesome-icon icon="edit" class="btn ms-auto px-3"
                                        @click.stop="editTask(index)" />
                                    <font-awesome-icon icon="trash" class="btn text-danger ms-auto px-3"
                                        @click.stop="deleteTask(task._id)" />
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="task, index in tasksSearched">
                        <div v-if="!task.completed" class="card mt-2">
                            <div class="align-middle text-dark p-3 mx-3 d-flex">
                                <span class="align-middle"><input type="checkbox" class="checkbox align-middle"
                                        @click="setCompletedTask(task._id, index)" /></span>
                                <span>&nbsp;&nbsp;&nbsp;{{ task.title }} ({{ plans.filter((plan) => plan._id ===
                                        task.planId)[0].title
                                }})</span>
                                <span class="star align-middle">
                                    <font-awesome-icon :class="{ 'text-warning': task.isImportant }" icon="star"
                                        class="btn ms-auto px-3" @click.stop="setImportantTask(task._id, index)" />
                                    <font-awesome-icon icon="edit" class="btn ms-auto px-3"
                                        @click.stop="editTask(index)" />
                                    <font-awesome-icon icon="trash" class="btn text-danger ms-auto px-3"
                                        @click.stop="deleteTask(task._id)" />
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
                <div @click="hideCompleted = !hideCompleted" class="btn border bg-light px-3 mt-5"><span>
                        <font-awesome-icon v-if="hideCompleted" icon="circle-chevron-up" />
                        <font-awesome-icon v-else="hideCompleted" icon="circle-chevron-down" />
                    </span> Hoàn thành</div>
                <template v-if="textSearch.length === 0">
                    <div v-if="!hideCompleted" class="mt-3">
                        <div v-for="task, index in tasks">
                            <div v-if="task.completed" class="card mt-2">
                                <div class="text-decoration-line-through align-middle text-dark p-3 mx-3 d-flex">
                                    <span class="align-middle"><input checked="true" type="checkbox"
                                            class="checkbox align-middle"
                                            @click="setCompletedTask(task._id, index)" /></span>
                                    <span>&nbsp;&nbsp;&nbsp;{{ task.title }} ({{ plans.filter((plan) => plan._id ===
                                            task.planId)[0].title
                                    }})</span>
                                    <span class="star align-middle">
                                        <font-awesome-icon icon="star" :class="{ 'text-warning': task.isImportant }"
                                            class="btn ms-auto px-3" @click.stop="setImportantTask(task._id, index)" />
                                        <font-awesome-icon icon="trash"
                                            class="btn text-danger ms-auto align-middle px-4"
                                            @click.stop="deleteTask(task._id)" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-if="!hideCompleted" class="mt-3">
                        <div v-for="task, index in tasksSearched">
                            <div v-if="task.completed" class="card mt-2">
                                <div class="text-decoration-line-through align-middle text-dark p-3 mx-3 d-flex">
                                    <span class="align-middle"><input checked="true" type="checkbox"
                                            class="checkbox align-middle"
                                            @click="setCompletedTask(task._id, index)" /></span>
                                    <span>&nbsp;&nbsp;&nbsp;{{ task.title }} ({{ plans.filter((plan) => plan._id ===
                                            task.planId)[0].title
                                    }})</span>
                                    <span class="star align-middle">
                                        <font-awesome-icon icon="star" :class="{ 'text-warning': task.isImportant }"
                                            class="btn ms-auto px-3" @click.stop="setImportantTask(task._id, index)" />
                                        <font-awesome-icon icon="trash"
                                            class="btn text-danger ms-auto align-middle px-4"
                                            @click.stop="deleteTask(task._id)" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div v-if="editing" class="col-3 border-end border-primary">
                <h5 class="text-center border-bottom-custom p-2">Chỉnh sửa</h5>
                <div class="row">
                    <input v-model="taskEdit.title" @keypress.enter="updateTask" type="text"
                        class="border rounded-2 w-75 text-start mx-auto p-3">

                </div>
                <div class="row">
                    <input v-model="taskEdit.description" @keypress.enter="updateTask" type="text" placeholder="Mô tả"
                        class="border rounded-2 w-75 text-start mt-3 mx-auto p-3">
                </div>
                <div class="row">
                    <select v-model="planTitleEdit" class="form-select form-select-lg w-75 mx-auto mt-3"
                        aria-label="form-select-lg example">
                        <option v-for="plan in plans" class="p-3">{{ plan.title }}</option>
                    </select>
                </div>
                <div class="col mx-auto mt-3">
                    <input v-model="taskEdit.isImportant" type="checkbox"
                        class="checkbox w-25 text-start d-inline align-middle" name="important">
                    <label for="important" class="align-middle">Quan trọng</label>
                </div>
                <div class="col mx-auto mt-3">
                    <input v-model="taskEdit.completed" type="checkbox"
                        class="checkbox w-25 text-start d-inline align-middle" name="important">
                    <label for="important" class="align-middle">Hoàn thành</label>
                </div>
                <div class="col w-100 d-flex justify-content-evenly">
                    <div @click="updateTask" class="btn btn-primary text-center mt-3 mx-auto px-3">Cập nhật</div>
                    <div @click="editing = false" class="btn btn-primary text-center mt-3 mx-auto px-3">Đóng</div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container mt-3">
        <h5 class="text-center mt-5 text-danger">Bạn chưa có công việc nào!</h5>
    </div>
</template>

<script>
import TaskService from '../services/task.service';
import PlanService from '../services/plan.service';
export default {
    data() {
        return {
            editingIndex: 0,
            taskEdit: {},
            editing: false,
            hideCompleted: false,
            plans: [],
            tasks: null,
            tasksSearched: [],
            textSearch: "",
            planTitleEdit: '',
        };
    },
    methods: {
        async getPlans() {
            this.plans = await PlanService.getAll();
        },
        async getTasks() {
            this.tasks = await TaskService.getAll();
        },
        async deleteTask(id) {
            try {
                await TaskService.delete(id);
                this.tasks = this.tasks.filter((task) => task._id !== id);
            }
            catch (error) {
                console.log(error);
            }
        },
        async setImportantTask(id, index) {
            try {
                this.tasks[index].isImportant = !this.tasks[index].isImportant;
                let result = await TaskService.update(id, this.tasks[index]);
                if (!result)
                    return;
            }
            catch (error) {
                console.log(error);
            }
        },
        async setCompletedTask(id, index) {
            try {
                this.tasks[index].completed = !this.tasks[index].completed;
                let result = await TaskService.update(id, this.tasks[index]);
                if (!result)
                    return;
            }
            catch (error) {
                console.log(error);
            }
        },
        editTask(index) {
            this.planTitleEdit = this.plans.filter((plan) => plan._id === this.tasks[index].planId)[0].title;
            this.editing = true;
            this.editingIndex = index;
            this.taskEdit = { ...this.tasks[index] };
        },
        async updateTask() {
            try {
                let newPlans = this.plans.filter((plan) => plan.title === this.planTitleEdit);
                this.taskEdit.planId = newPlans[0]._id;
                let result = await TaskService.update(this.taskEdit._id, this.taskEdit);
                if (!result)
                    return;
                this.tasks[this.editingIndex] = { ...this.taskEdit };
                this.editing = false;
                this.planEdit = {};
            }
            catch (error) {
                console.log(error);
            }
        },
    },
    async created() {
        await this.getTasks();
        await this.getPlans();
    },
    watch: {
        textSearch(newText) {
            if (newText.length === 0)
                this.searching = false;
            this.tasksSearched = this.tasks.filter((task) => task.title.includes(newText));
        },
    },
}
</script>
<style src="../assets/tasks.css">

</style>