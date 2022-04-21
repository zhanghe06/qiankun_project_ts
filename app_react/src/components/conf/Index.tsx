import React, { useState } from 'react';
import { message, Row, Col, Space } from 'antd';
import ProForm, { ProFormText, ProFormDigit } from '@ant-design/pro-form';
import ConfService from '../../api/conf';


export default () => {
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };

    return (
        <ProForm<{
            server_host: string;
            server_port: number;
            from_email: string;
            from_passwd: string;
            from_name?: string;
        }>
            name="confForm"
            {...formItemLayout}
            layout="horizontal"
            submitter={{
                render: (props, doms) => {
                    return (
                        <Row>
                            <Col span={14} offset={4}>
                                <Space>{doms}</Space>
                            </Col>
                        </Row>
                    );
                },
            }}
            onFinish={async (values) => {
                const res = await ConfService.put_email(values);
                console.log(values);
                console.log(res);
                message.success({
                    content: '提交成功',
                    getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')
                });
            }}
            params={{}}
            request={async (
                params = {},
            ) => {
                // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                // 如果需要转化参数可以在这里进行修改
                const msg = await ConfService.get_email();
                return msg.data;
            }}
            labelAlign="left"
        >
            <ProFormText
                width="md"
                required={true}
                name="server_host"
                label="邮箱服务器地址"
                placeholder="请输入邮箱服务器地址"
                rules={
                    [
                        { required: true, message: '邮箱服务器地址不能为空' },
                        { max: 30, message: '长度范围3~30个字符' },
                        { min: 3, message: '长度范围3~30个字符' },
                    ]
                }
            />
            <ProFormDigit
                width="md"
                required={true}
                name="server_port"
                label="邮箱服务器端口"
                placeholder="请输入邮箱服务器端口"
                max={65535}
                min={1}
                rules={
                    [
                        { required: true, message: '邮箱服务器端口不能为空' },
                    ]
                }
            />
            <ProFormText
                width="md"
                required={true}
                name="from_email"
                label="发件人邮箱地址"
                placeholder="请输入发件人邮箱地址"
                rules={
                    [
                        { required: true, message: '发件人邮箱地址不能为空' },
                        { max: 100, message: '长度范围5~100个字符' },
                        { pattern: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/, message: '请输入正确的邮箱格式' },
                    ]
                }
            />
            <ProFormText.Password
                width="md"
                required={true}
                name="from_passwd"
                label="发件人邮箱客户端授权码"
                tooltip="注意：不是登录密码"
                placeholder="请输入发件人邮箱客户端授权码"
                rules={[{ required: true, message: '邮箱客户端授权码不能为空' }]}
            />
        </ProForm>
    );
};
