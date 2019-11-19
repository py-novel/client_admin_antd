import React, { useEffect, useState } from 'react'
import { Card, Table, Descriptions, Modal, message, Popconfirm, Divider } from 'antd'
import axios from 'axios'
import { ColumnProps, PaginationConfig } from 'antd/es/table'
import QueryForm from './components/QueryForm'
import EditModal from './components/EditModal'

export interface IClassify {
    id?: number;
    path: string;
    desc: string;
}

export default function () {
    const [ list, setList ] = useState([])
    const [ queryData, setQueryData ] = useState<{[key: string]: any}>({ _page: 1, _limit: 10 })
    const [ page, setPage ] = useState<PaginationConfig>()
    const [ checkVisible, setCheckVisible ] = useState<boolean>(false)
    const [ currentItem, setCurrentItem ] = useState<IClassify|null>(null)
    const [ editVisible, setEditVisible ] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
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
     * 查
     * @param record 
     */
    const check = (record: IClassify) => {
        setCurrentItem(record)
        setCheckVisible(true)
    }

    /**
     * 删
     * @param record 
     */
    const deleteItem = async (record: IClassify) => {
        const result = await axios.delete(`/api/v1/classify/${record.id}`)
        message.success('操作成功')
        setQueryData({ ...queryData })    // 新增完成后刷新表格
    }

    const showEditModal = (record: IClassify) => {
        setCurrentItem(record)
        setEditVisible(true)
    }

    /**
     * 增 & 改
     * @param data 
     * @param currentItem 
     */
    const editModalOk = async (data: IClassify, currentItem: IClassify) => {
        if (currentItem) {
            await axios.put(`/api/v1/classify/${data.id}`, data)
        } else {
            await axios.post('/api/v1/classify', data)
        }
        message.success('操作成功')
        setEditVisible(false)
        setCurrentItem(null)
        setQueryData({ ...queryData })    // 新增完成后刷新表格
    }

    /**
     * 点击分页按钮时携带查询参数
     */
    const pagination: PaginationConfig = {
        ...page,
        position: 'top',
        onChange: (page, pageSize) => setQueryData({ ...queryData, _page: page, _limit: pageSize}),
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
                  <Popconfirm title="确认删除?"
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => deleteItem(record)}>
                    <a>删除</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a onClick={() => showEditModal(record)}>
                    编辑
                  </a>
                </span>
              )
            }, 
        }
    ]

    return (
        <>
            <Card style={{ marginBottom: '16px' }}>
                <QueryForm setQueryData={setQueryData} queryData={queryData} setEditVisible={setEditVisible} />
            </Card>

            <Card>
                <Table dataSource={list}
                    columns={columns}
                    size="middle"
                    bordered={true}
                    pagination={pagination}
                    rowKey="id" />
            </Card>

            {
                checkVisible && currentItem && (
                    <Modal visible={true}
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

            {
                editVisible && <EditModal currentItem={currentItem} visible={editVisible} 
                    onCancel={setEditVisible} onOk={editModalOk}/>}
        </>
    )
}
