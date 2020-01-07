import React, { useEffect, useState } from 'react'
import { Card, Table, Descriptions, Modal, message, Popconfirm, Divider, Button, Form, Row, Col, Input } from 'antd'
import axios from 'axios'
import { ColumnProps, PaginationConfig } from 'antd/es/table'
import { FormComponentProps } from 'antd/es/form'

export interface IClassify {
    id?: number;
    path: string;
    desc: string;
}

export default function () {
    const [list, setList] = useState<Array<IClassify>>([])                    // 表格数据
    const [queryData, setQueryData] = useState<{ [key: string]: any }>({ _page: 1, _limit: 10 })        // 查询条件
    const [page, setPage] = useState<PaginationConfig>()                      // 分页参数
    const [checkVisible, setCheckVisible] = useState<boolean>(false)          // 查看模态框是否可见
    const [editVisible, setEditVisible] = useState<boolean>(false)            // 新增/编辑模态框是否可见
    const [currentItem, setCurrentItem] = useState<IClassify | null>()        // 表格当前操作行 

    useEffect(() => {
        async function fetchData() {
            const result = await axios.get('/api/v1/classify', { params: queryData })
            const pagination = {
                current: queryData._page,
                pageSize: queryData._limit || 10,
                total: Number(result.headers['x-total-count']),   // json-server 返回数据总条数放在响应头中
            }

            setList(result.data)
            setPage(pagination)
        }
        fetchData()
    }, [queryData])

    /**
     * 查询表单
     */
    const QueryForm = ({ form }: FormComponentProps) => {
        const { getFieldDecorator, getFieldsValue, resetFields } = form

        const search = () => {
            const data = getFieldsValue()
            setQueryData({ ...queryData, ...data, _page: 1, _limit: 10 })
        }

        const reset = () => {
            resetFields(Object.keys(getFieldsValue()))
            setQueryData({ _page: 1, _limit: 10 })
        }

        const showEditModal = () => {
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
            <Form>
                <Row gutter={24}>
                    <Col {...colLayout}>
                        <Form.Item {...formLayout} label="描述">
                            {
                                getFieldDecorator('desc_like', { initialValue: queryData.desc_like })
                                    (<Input placeholder="请输入描述" />)
                            }
                        </Form.Item>
                    </Col>
                </Row>

                <Row type="flex" justify="space-between">
                    <Col>
                        <Button type="primary" icon="search" onClick={search}>查询</Button>
                        <Button icon="reload" style={{ marginLeft: '16px' }} onClick={reset}>重置</Button>
                    </Col>

                    <Col>
                        <Button type="primary" onClick={showEditModal}>新增</Button>
                    </Col>
                </Row>
            </Form>
        )
    }

    const AQueryForm = Form.create()(QueryForm)

    /**
     * 表格
     */
    const TableComp = () => {
        const remove = async (record: IClassify) => {
            await axios.delete(`/api/v1/classify/${record.id}`)
            setQueryData({ ...queryData, _page: 1, _limit: 10 })    // 新增完成后刷新表格
            message.success('操作成功')
        }

        const check = (record: IClassify) => {
            setCurrentItem(record)
            setCheckVisible(true)
        }

        const showEditModal = (record: IClassify) => {
            setEditVisible(true)
            setCurrentItem(record)
        }

        const columns: ColumnProps<IClassify>[] = [
            {
                title: '主键',
                dataIndex: 'id',
                align: 'center',
                render: (text: any, record: any) => <a onClick={() => check(record)}>{text}</a>,
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
                                onConfirm={() => remove(record)}>
                                <Button type="link">删除</Button>
                            </Popconfirm>
                            <Divider type="vertical" />
                            <Button type="link" onClick={() => showEditModal(record)}>
                                编辑
                      </Button>
                        </span>
                    )
                },
            }
        ]

        const pagination: PaginationConfig = {
            ...page,
            position: 'top',
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
            />
        )
    }

    /**
     * 新增/编辑模态框
     */
    const EditModal = ({ form }: FormComponentProps) => {
        const { getFieldDecorator, validateFields, getFieldsValue } = form

        const submit = () => {
            validateFields(async (err) => {
                if (err) return
                const data = getFieldsValue()

                if (currentItem) {
                    await axios.put(`/api/v1/classify/${currentItem.id}`, data)
                } else {
                    await axios.post('/api/v1/classify', data)
                }

                message.success('操作成功')
                setEditVisible(false)
                setCurrentItem(null)
                setQueryData({ ...queryData })    // 新增完成后刷新表格
            })
        }

        const close = () => {
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
                onOk={submit}
                onCancel={close}
            >
                <Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item {...formLayout} label="路径" hasFeedback={true}>
                                {
                                    getFieldDecorator('path', {
                                        initialValue: currentItem && currentItem.path,
                                        rules: [
                                            {
                                                message: '路径不能为空',
                                                required: true,
                                            },
                                        ],
                                    })(<Input placeholder="请输入路径" />)
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Form.Item {...formLayout} label="描述" hasFeedback={true}>
                                {
                                    getFieldDecorator('desc', {
                                        initialValue: currentItem && currentItem.desc,
                                        rules: [
                                            {
                                                message: '描述不能为空',
                                                required: true,
                                            },
                                        ],
                                    })(<Input placeholder="请输入描述" />)
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }

    const AEditModal = Form.create()(EditModal)

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
                <AQueryForm />
            </Card>

            <Card>
                <TableComp />
            </Card>

            {checkVisible && <CheckModal />}
            {editVisible && <AEditModal />}
        </>
    )
}
