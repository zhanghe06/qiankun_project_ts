import React, { useState } from 'react';
import { message, Row, Col, Space } from 'antd';
import ProForm, { ProFormText, ProFormDigit } from '@ant-design/pro-form';
import ConfService from '../../api/conf'


export default () => {
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };

    return (
        <ProForm<{
            server_host: string;
            server_port: string;
            from_email: string;
            from_passwd: string;
            from_name?: string;
        }>
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
                message.success('提交成功');
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
        >
            <ProFormText
                width="md"
                required={true}
                name="server_host"
                label="邮箱服务器地址"
                placeholder="请输入邮箱服务器地址"
            />
            <ProFormText
                width="md"
                required={true}
                name="server_port"
                label="邮箱服务器端口"
                placeholder="请输入邮箱服务器端口"
            />
            <ProFormText
                width="md"
                required={true}
                name="from_email"
                label="发件人邮箱地址"
                placeholder="请输入发件人邮箱地址"
            />
            <ProFormText
                width="md"
                required={true}
                name="from_passwd"
                label="发件人邮箱客户端授权码"
                tooltip="注意：不是登录密码"
                placeholder="请输入发件人邮箱客户端授权码"
            />
        </ProForm>
    );
};
