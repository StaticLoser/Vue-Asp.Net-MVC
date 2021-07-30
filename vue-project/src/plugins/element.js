import Vue from 'vue'
import {
    Button,
    Table,
    TableColumn,
    Loading,
    Container,
    Aside,
    Header,
    Footer,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    RadioButton,
    Main,
    Input,
    Message,
    MessageBox,
    Dialog,
    Form,
    FormItem,
    Select,
    Option,
    Pagination,
    Switch,
    Avatar,
    Tag,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Progress,
    Row
} from 'element-ui'
Vue.use(Loading)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(RadioButton)
Vue.use(Main)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Avatar)
Vue.use(Tag)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Progress)
Vue.use(Row)
Vue.component(Message)
// Vue.use(MessageBox)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm