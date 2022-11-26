import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faListCheck, faAdd, faStar, faCircleChevronUp, faCircleChevronDown, faTrash, faEdit, faSearch, faClose} from "@fortawesome/free-solid-svg-icons";
library.add(faListCheck, faAdd, faStar, faCircleChevronUp, faCircleChevronDown, faTrash, faEdit, faSearch, faClose);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from './router/index';
createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
