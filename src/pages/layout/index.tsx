import React, { useState } from 'react'
import { Layout, Menu, Avatar } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, createFromIconfontCN } from '@ant-design/icons'
import { history } from 'umi'
import logo from '../../assets/logo.png'
import styles from './index.less'
import menus, { IMenu } from '../../configs/menu'
import { iconfontJs } from '../../configs/config'

const IconFont = createFromIconfontCN({
    scriptUrl: iconfontJs,
});

const { Header, Sider, Content } = Layout;

/**
 * 将列表数据转换为树形结构的数据
 */
export const arrayToTree = (array: IMenu[]) => {
    const data: IMenu[] = JSON.parse(JSON.stringify(array))

    const hash: { [key: string]: IMenu } = {}
    data.forEach((item: IMenu) => {
        hash[item['id']] = item
    })

    const result: Array<IMenu> = []
    data.forEach((item: IMenu) => {
        const hashVP = hash[item['mpid'] as string]
        if (hashVP) {
            if (!hashVP['children']) hashVP['children'] = []
            hashVP['children'].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

/**
 * 递归将树形结构数据转换为菜单的 <Menu> 标签用于渲染页面
 */
const geneMenuElements = (menuTree: IMenu[]) => {
    return menuTree.map((item) => {
        if (item.children) {
            return (
                <Menu.SubMenu
                    key={item.id}
                    title={<span>
                        {item.icon && <IconFont type={item.icon} />}
                        <span>{item.name}</span>
                    </span>}
                >
                    {geneMenuElements(item.children)}
                </Menu.SubMenu>
            )
        }
        return (
            <Menu.Item key={item.id} onClick={() => history.push(item.router as string)}>
                {item.icon && <IconFont type={item.icon} />}
                <span>{item.name}</span>
            </Menu.Item>
        )
    })
}

export default function ({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState<boolean>(false)

    // 列表数据转树形结构
    const menuTree = arrayToTree(menus)

    // 生成菜单元素 Element
    const menuElement = geneMenuElements(menuTree)

    return (
        <Layout>
            <Sider trigger={null} collapsible={true} collapsed={collapsed}>
                <div className={styles.logo}>
                    <Avatar src={logo} />
                    {!collapsed && <div>公羊阅读后管系统</div>}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    {menuElement}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <span className={styles.trigger} onClick={() => setCollapsed(!collapsed)}>
                        {
                            collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                        }
                    </span>
                </Header>
                <Content className={styles.content}>
                    {children}
                </Content>
                <div className={styles.footer}>
                    develop at 2019年11月19日11:28:12 © dkvirus
                </div>
            </Layout>
        </Layout>
    )
}
