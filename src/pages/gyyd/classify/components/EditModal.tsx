import React from 'react'
import { Form, Modal, Row, Col, Input } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { IClassify } from '../index'

interface IEditModalProps extends FormComponentProps {
    currentItem: IClassify | null;
    onCancel: Function;
    onOk: Function;
    visible: boolean;
}

function EditModal ({ form, currentItem, onCancel, onOk, visible }: IEditModalProps) {
    const { getFieldDecorator, validateFields, getFieldsValue } = form

    // 表单布局
    const formLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }

    const onOkBtn = () => {
        validateFields((err) => {
            if (err) return
            const data = getFieldsValue()
            onOk(data, currentItem)
        })
    }

    return (
        <Modal 
            visible={visible}
            maskClosable={false}
            title={currentItem ? '编辑' : '新增'}
            onOk={() => onOkBtn()}
            onCancel={() => onCancel(false)}>
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

export default Form.create<IEditModalProps>()(EditModal)
