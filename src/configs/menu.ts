export interface IMenu {
    id: string;
    name: string;
    icon?: string;
    mpid?: string;
    router?: string;
    children?: Array<IMenu>;
}

const menus: IMenu[] = [
    {
        id: 'gyyd',
        name: '阅读管理',
        icon: 'icon-yuedu',
    },
    {
        id: 'gyyd-classify',
        icon: 'icon-fenlei-copy',
        mpid: 'gyyd',
        name: '分类管理',
        router: '/gyyd/classify',
    },
]

export default menus
