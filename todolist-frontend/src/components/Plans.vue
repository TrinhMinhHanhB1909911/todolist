<template>
    <div class="container mt-3">
        <div class="row align-items-start">
            <div :class="{ 'border-start border-primary': this.plans.length !== 0 }" class="col-3 container bg-none">
                <h5 :class="{ 'border-bottom-custom mb-3': this.plans.length !== 0 }" class="text-center p-2">
                    Kế hoạch
                </h5>
                <template v-for="plan, index in plans">
                    <div :class="{ 'bg-primary text-light': activeIndex === index }"
                        class="btn d-block text-start" @click="getPlanTasks(plan._id, index)">
                        <div class="d-flex p-2">
                            <font-awesome-icon icon="list-check" class="align-middle p-1" />
                            <span class="px-1 me-auto mw-25 align-middle overflow-hidden">{{ plan.title }}</span>
                            <font-awesome-icon icon="edit" class="btn align-middle" @click.stop="editPlan(index)" />
                            <font-awesome-icon icon="trash" class="btn text-danger align-middle"
                                @click.stop="deletePlan(plan._id, index)" />

                        </div>
                    </div>
                </template>
                <input @keypress.enter="addPlan" v-model="planInput" type="text" placeholder="+Thêm kế hoạch mới"
                    class="rounded-2 border border-primary mt-3 p-2 px-2 w-100">
            </div>
            <div v-if="this.plans.length !== 0"
                :class="{ 'col-9': (!taskEditing && !planEditing), 'col-6': (taskEditing || planEditing) }"
                class="tasks container rounded-2 p-3 px-5">
                <h5 class="text-center text-light pb-3">
                    Công việc
                </h5>
                <div v-for="task, index in tasks">
                    <div v-if="!task.completed" class="card mt-2">
                        <div class="align-middle text-dark p-3 mx-3 d-flex">
                            <span class="align-middle"><input type="checkbox" class="checkbox align-middle"
                                    @click="setCompletedTask(task._id, index)" /></span>
                            <span>&nbsp;&nbsp;&nbsp;{{ task.title }}</span>
                            <span class="star align-middle">
                                <font-awesome-icon :class="{ 'text-warning': task.isImportant }" icon="star"
                                    class="btn ms-auto px-3" @click.stop="setImportantTask(task._id, index)" />
                                <font-awesome-icon icon="edit" class="btn ms-auto px-3" @click.stop="editTask(index)" />
                                <font-awesome-icon icon="trash" class="btn text-danger ms-auto px-3"
                                    @click.stop="deleteTask(task._id)" />
                            </span>
                        </div>
                    </div>
                </div>
                <div @click="hideCompleted = !hideCompleted" class="btn border bg-light px-3 mt-5"><span>
                        <font-awesome-icon v-if="hideCompleted" icon="circle-chevron-up" />
                        <font-awesome-icon v-else="hideCompleted" icon="circle-chevron-down" />
                    </span> Hoàn thành</div>

                <div v-if="!hideCompleted">
                    <div v-for="task, index in tasks">
                        <div v-if="task.completed" class="card mt-2">
                            <div class="text-decoration-line-through align-middle text-dark p-3 mx-3 d-flex">
                                <span class="align-middle"><input checked="true" type="checkbox"
                                        class="checkbox align-middle"
                                        @click="setCompletedTask(task._id, index)" /></span>
                                <span>&nbsp;&nbsp;&nbsp;{{ task.title }}</span>
                                <span class="star align-middle">
                                    <font-awesome-icon icon="star" :class="{ 'text-warning': task.isImportant }"
                                        class="btn ms-auto px-3" @click.stop="setImportantTask(task._id, index)" />
                                    <font-awesome-icon icon="trash" class="btn text-danger ms-auto align-middle px-4"
                                        @click.stop="deleteTask(task._id)" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="divider mt-5">
                <input @keypress.enter="addTask" v-model="taskInput" type="text" placeholder="+Thêm công việc"
                    class="border rounded-2 w-100 text-start mb-3 p-3">
            </div>
            <div v-if="taskEditing" class="col-3 border-end border-primary">
                <h5 class="text-center border-bottom-custom p-2 mb-3">Chỉnh sửa (Công việc)</h5>
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
                    <div @click="taskEditing = false" class="btn btn-primary text-center mt-3 mx-auto px-3">Đóng</div>
                </div>
            </div>
            <div v-if="planEditing" class="col-3 border-end border-primary">
                <h5 class="text-center border-bottom-custom p-2 mb-3">Chỉnh sửa (Kế hoạch)</h5>
                <div class="row">
                    <input v-model="planEdit.title" @keypress.enter="updatePlan" type="text"
                        class="border rounded-2 w-75 text-start mx-auto p-3">
                </div>
                <div class="row">
                    <input v-model="planEdit.description" @keypress.enter="updatePlan" type="text" placeholder="Mô tả"
                        class="border rounded-2 w-75 text-start mt-3 mx-auto p-3">
                </div>
                <div class="col w-100 d-flex justify-content-evenly">
                    <div @click="updatePlan" class="btn btn-primary text-center mt-3 mx-auto px-3">Cập nhật</div>
                    <div @click="planEditing = false" class="btn btn-primary text-center mt-3 mx-auto px-3">Đóng</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { RouterView } from 'vue-router';
import PlanService from '../services/plan.service';
import TaskService from '../services/task.service';
export default {
    data() {
        return {
            plans: null,
            tasks: [],
            activeIndex: 0,
            taskInput: '',
            planInput: '',
            hideCompleted: false,
            taskEditing: false,
            planEditing: false,
            editingIndex: 0,
            taskEdit: {},
            planTitleEdit: '',
            planEdit: {},
            planTextToEdit: '',
        };
    },
    methods: {
        async getAllPlans() {
            try {
                this.plans = await PlanService.getAll();
            }
            catch (error) {
                console.log(error);
            }
        },
        async getAllTasks() {
            try {
                this.tasks = await TaskService.getAll();
            }
            catch (error) {
                console.log(error);
            }
        },
        async getPlanTasks(planId, index) {
            this.planEditing = false;
            this.taskEditing = false;
            this.activeIndex = index;
            try {
                this.tasks = [];
                this.tasks = await TaskService.getPlanTasks(planId);
                console.log(this.tasks);
            }
            catch (error) {
                console.log(error);
            }
        },
        async addTask() {
            let title = this.taskInput;
            this.taskInput = "";
            try {
                let task = {
                    planId: this.plans[this.activeIndex]._id,
                    title: title,
                    description: "",
                    isImportant: false,
                    completed: false,
                };
                let newTask = await TaskService.create(task);
                this.tasks.push(newTask);
            }
            catch (error) {
                console.log(error);
            }
        },
        async addPlan() {
            let title = this.planInput;
            this.planInput = '';
            try {
                let plan = {
                    title: title,
                    isImportant: false,
                    completed: false,
                };
                let newPlan = await PlanService.create(plan);
                this.plans.push(newPlan);
            } catch (error) {
                console.log(error);
            }
        },
        async deletePlan(id, index) {
            if (!confirm('Bạn có chắc muốn xóa?')) return;
            try {
                let allTasks = await TaskService.getAll();
                for (var task of allTasks) {
                    if (task.planId === id) {
                        TaskService.delete(task._id);
                    }
                }
                let result = await PlanService.delete(id);
                if (!result) return;
                if (this.plans[this.activeIndex]._id === id) {
                    this.activeIndex = 0;
                }
                if (index < this.activeIndex) {
                    this.activeIndex--;
                }
                this.plans = this.plans.filter((plan) => plan._id !== id);
                await this.getPlanTasks(this.plans[this.activeIndex]._id, this.activeIndex);
            } catch (error) {
                console.log(error);
            }
            if (this.plans.length === 0) this.tasks = [];
        },
        async deleteTask(id) {
            try {
                await TaskService.delete(id);
                this.tasks = this.tasks.filter((task) => task._id !== id);
            } catch (error) {
                console.log(error);
            }
        },
        async setImportantTask(id, index) {
            try {
                this.tasks[index].isImportant = !this.tasks[index].isImportant;
                let result = await TaskService.update(id, this.tasks[index]);
                if (!result) return;
            } catch (error) {
                console.log(error);
            }
        },
        async setCompletedTask(id, index) {
            try {
                this.tasks[index].completed = !this.tasks[index].completed;
                let result = await TaskService.update(id, this.tasks[index]);
                if (!result) return;
            } catch (error) {
                console.log(error);
            }
        },
        editTask(index) {
            this.planEditing = false;
            this.planTitleEdit = this.plans.filter((plan) => plan._id === this.tasks[index].planId)[0].title;
            this.taskEditing = true;
            this.editingIndex = index;
            this.taskEdit = { ...this.tasks[index] };
        },
        async updateTask() {
            try {
                let newPlans = this.plans.filter((plan) => plan.title === this.planTitleEdit);
                this.taskEdit.planId = newPlans[0]._id;
                let result = await TaskService.update(this.taskEdit._id, this.taskEdit);
                if (!result) return;
                if (this.taskEdit.planId === this.tasks[this.editingIndex].planId) {
                    this.tasks[this.editingIndex] = { ...this.taskEdit };
                } else {
                    this.tasks = this.tasks.filter((task) => task._id !== this.taskEdit._id);
                }
                this.taskEditing = false;
            } catch (error) {
                console.log(error);
            }
        },
        editPlan(index) {
            this.activeIndex = index;
            this.taskEditing = false;
            this.planTextToEdit = this.plans[index].title;
            this.planEditing = true;
            this.editingIndex = index;
            this.planEdit = { ...this.plans[index] };
        },
        async updatePlan() {
            try {
                let result = await PlanService.update(this.planEdit._id, this.planEdit);
                if (!result) return;
                if (this.planEdit.planId === this.plans[this.editingIndex].planId) {
                    this.plans[this.editingIndex] = { ...this.planEdit };
                } else {
                    this.plans = this.plans.filter((plan) => plan._id !== this.planEdit._id);
                }
                this.planEditing = false;
            } catch (error) {
                console.log(error);
            }
        },
    },
    async created() {
        await this.getAllPlans();
        await this.getPlanTasks(this.plans[this.activeIndex]._id, this.activeIndex);
    },
    computed: {
        getTasks() {
            return this.tasks;
        }
    },
    components: { FontAwesomeIcon, RouterView }
}
</script>

<style src="../assets/plans.css">

</style>