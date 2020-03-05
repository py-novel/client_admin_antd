import React, { useEffect, useState } from 'react'
import { Card, Table, Descriptions, Modal, message, Popconfirm, Divider, Button, Form, Row, Col, Input } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { ColumnProps } from 'antd/es/table'
import { PaginationProps } from 'antd/es/pagination'
import { useForm } from 'antd/lib/form/util'

export interface IClassify {
    id?: number;
    path: string;
    desc: string;
}

export default function () {
    const [list, setList] = useState<Array<IClassify>>([])                    // 表格数据
    const [queryData, setQueryData] = useState<{ [key: string]: any }>({ _page: 1, _limit: 10 })        // 查询条件
    const [page, setPage] = useState<PaginationProps>()                       // 分页参数
    const [checkVisible, setCheckVisible] = useState<boolean>(false)          // 查看模态框是否可见
    const [editVisible, setEditVisible] = useState<boolean>(false)            // 新增/编辑模态框是否可见
    const [currentItem, setCurrentItem] = useState<IClassify | null>()        // 表格当前操作行 
    const [loading, setLoading] = useState<boolean>(false)                    // 是否在请求中

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const result = await axios.get('/api/v1/classify', { params: queryData })
            const pagination = {
                current: queryData._page,
                pageSize: queryData._limit || 10,
                total: Number(result.headers['x-total-count']),   // json-server 返回数据总条数放在响应头中
            }

            setList(result.data)
            setPage(pagination)
            setLoading(false)
        }
        fetchData()
    }, [queryData])

    /**
     * 查询表单
     */
    const QueryForm = () => {
        const [form] = Form.useForm();
        const { getFieldsValue, resetFields } = form

        const onSearch = () => {
            const data = getFieldsValue()
            setQueryData({ ...queryData, ...data, _page: 1, _limit: 10 })
        }

        const onReset = () => {
            resetFields(Object.keys(getFieldsValue()))
            setQueryData({ _page: 1, _limit: 10 })
        }

        const onShowEditModal = () => {
            setEditVisible(true)
            setCurrentItem(null)
        }

        const formLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        }

        const colLayout = {
            xs: 24,   // < 576px
            sm: 24,   // >= 576px
            md: 24,   // >= 768px
            xl: 8,    // >= 1200px
        }

        return (
            <Form {...formLayout} form={form}>
                <Row gutter={24}>
                    <Col {...colLayout}>
                        <Form.Item name="desc_like" label="描述">
                            <Input placeholder="请输入描述" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="space-between">
                    <Col>
                        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>查询</Button>
                        <Button style={{ marginLeft: '8px' }} icon={<ReloadOutlined />} onClick={onReset}>重置</Button>
                    </Col>

                    <Col>
                        <Button type="primary" onClick={onShowEditModal}>新增</Button>
                    </Col>
                </Row>
            </Form>
        )
    }

    /**
     * 表格
     */
    const TableComp = () => {
        const onRemove = async (record: IClassify) => {
            await axios.delete(`/api/v1/classify/${record.id}`)
            setQueryData({ ...queryData, _page: 1, _limit: 10 })    // 新增完成后刷新表格
            message.success('操作成功')
        }

        const onCheck = (record: IClassify) => {
            setCurrentItem(record)
            setCheckVisible(true)
        }

        const onShowEditModal = (record: IClassify) => {
            setEditVisible(true)
            setCurrentItem(record)
        }

        const columns: ColumnProps<IClassify>[] = [
            {
                title: '主键',
                dataIndex: 'id',
                align: 'center',
                render: (text: any, record: any) => <a onClick={() => onCheck(record)}>{text}</a>,
            },
            {
                title: '路径',
                dataIndex: 'path',
            },
            {
                title: '描述',
                dataIndex: 'desc',
            },
            {
                title: '操作',
                key: 'action',
                width: 250,
                render: (text: any, record: IClassify) => {
                    return (
                        <span>
                            <Popconfirm
                                title="确认删除?"
                                okText="确认"
                                cancelText="取消"
                                onConfirm={() => onRemove(record)}>
                                <Button type="link">删除</Button>
                            </Popconfirm>
                            <Divider type="vertical" />
                            <Button type="link" onClick={() => onShowEditModal(record)}>
                                编辑
                      </Button>
                        </span>
                    )
                },
            }
        ]

        const pagination: PaginationProps = {
            ...page,
            onChange: (page, pageSize) => setQueryData({ ...queryData, _page: page, _limit: pageSize }),
        }

        return (
            <Table
                dataSource={list}
                columns={columns}
                size="middle"
                bordered={true}
                pagination={pagination}
                rowKey="id"
                loading={loading}
            />
        )
    }

    /**
     * 新增/编辑模态框
     */
    const EditModal = () => {
        const [form] = useForm()

        const onSubmit = async () => {
            const data = await form.validateFields()
            if (currentItem) {
                await axios.put(`/api/v1/classify/${currentItem.id}`, data)
            } else {
                await axios.post('/api/v1/classify', data)
            }

            message.success('操作成功')
            setEditVisible(false)
            setCurrentItem(null)
            setQueryData({ ...queryData })    // 新增完成后刷新表格
        }

        const onClose = () => {
            setEditVisible(false)
            setCurrentItem(null)
        }

        // 表单布局
        const formLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }

        return (
            <Modal
                visible={true}
                maskClosable={false}
                title={currentItem ? '编辑' : '新增'}
                onOk={onSubmit}
                onCancel={onClose}
            >
                <Form {...formLayout} form={form} initialValues={currentItem || {}}>
                    <Form.Item
                        name="path"
                        label="路径"
                        hasFeedback={true}
                        rules={[{ required: true, message: '路径不能为空' }]}
                    >
                        <Input placeholder="请输入路径" />
                    </Form.Item>

                    <Form.Item
                        name="desc"
                        label="描述"
                        hasFeedback={true}
                        rules={[{ required: true, message: '描述不能为空' }]}
                    >
                        <Input placeholder="请输入描述" />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    /**
     * 查看模态框
     */
    const CheckModal = () => {
        if (!currentItem) return null

        return (
            <Modal
                visible={true}
                title="查看"
                footer={null}
                onCancel={() => setCheckVisible(false)}
            >
                <Descriptions column={1} bordered={true}>
                    <Descriptions.Item label="主键">{currentItem.id}</Descriptions.Item>
                    <Descriptions.Item label="路径">{currentItem.path}</Descriptions.Item>
                    <Descriptions.Item label="描述">{currentItem.desc}</Descriptions.Item>
                </Descriptions>
            </Modal>
        )
    }

    return (
        <>
            <Card style={{ marginBottom: '16px' }}>
                <QueryForm />
            </Card>

            <Card>
                <TableComp />
            </Card>

            {checkVisible && <CheckModal />}
            {editVisible && <EditModal />}
        </>
    )
}
