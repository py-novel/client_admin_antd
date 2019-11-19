import React from 'react'
import { Form, Row, Col, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/es/form'

interface IQueryFormProps extends FormComponentProps {
    setQueryData: Function;
    queryData: { [key: string]: any };
    setEditVisible: Function;
}

function QueryForm ({ form, setQueryData, queryData, setEditVisible }:IQueryFormProps ) {
    const { getFieldDecorator } = form

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

    const search = () => {
        const data = form.getFieldsValue()
        setQueryData({...queryData, ...data})
    }

    const reset = () => {
        form.resetFields(Object.keys(form.getFieldsValue()))
        setQueryData({...queryData, desc_like: undefined})
    }

    return (
        <Form>
            <Row gutter={24}>
                <Col {...colLayout}>
                    <Form.Item {...formLayout} label="描述">
                        {getFieldDecorator('desc_like')(<Input placeholder="请输入描述" />)}
                    </Form.Item>
                </Col>
            </Row>

            <Row type="flex" justify="space-between">
                <Col>
                    <Button type="primary" icon="search" onClick={search}>查询</Button>
                    <Button icon="reload" style={{ marginLeft: '16px' }}  onClick={reset}>重置</Button>
                </Col>

                <Col>
                    <Button type="primary" onClick={() => setEditVisible(true, {})}>新增</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default Form.create<IQueryFormProps>()(QueryForm)
