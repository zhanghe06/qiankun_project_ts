import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Row, Col, Space, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from 'umi-request';
import ProForm, {
    DrawerForm,
    ProFormCheckbox,
    ProFormRadio,
    ProFormText,
} from '@ant-design/pro-form';

type StrategyItem = {
    id: number;
    notice_type: number;
    trigger_threshold: number;
    to_emails: string;
    enabled_state: number;
    deleted_state: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    created_by: string;
    updated_by: string;
    deleted_by?: string;
};

const columns: ProColumns<StrategyItem>[] = [
    {
        title: '通知类型',
        dataIndex: 'notice_type',
        copyable: true,
        ellipsis: true,
        valueType: 'select',
        valueEnum: {
            '': { text: '全部类型', status: 'Default', default: true},
            0: {
                text: '邮件',
                status: 'Default',
            },
            1: {
                text: '短信',
                status: 'Default',
                disabled: true,
            },
        },
    },
    {
        title: '通知时间',
        dataIndex: 'trigger_threshold',
        search: false,
    },
    {
        title: '通知账号',
        dataIndex: 'to_emails',
        search: false,
    },
    {
        title: '策略状态',
        dataIndex: 'enabled_state',
        copyable: true,
        ellipsis: true,
        valueType: 'select',
        valueEnum: {
            '': { text: '全部状态', status: 'Default' },
            0: {
                text: '停用',
                status: 'Error',
            },
            1: {
                text: '启用',
                status: 'Success',
            },
        },
    },
    {
        title: '创建时间',
        key: 'showTime',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        sorter: true,
        hideInSearch: true,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateRange',
        hideInTable: true,
        search: {
            transform: (value) => {
                return {
                    startTime: value[0],
                    endTime: value[1],
                };
            },
        },
    },
    {
        title: '操作',
        valueType: 'option',
        render: (text, record, _, action) => [
            <a key="editable">编辑</a>,
            <a key="delete">删除</a>,
            <a href="" target="_blank" rel="noopener noreferrer" key="view">
                查看
            </a>,
        ],
    },
];


export default () => {
    const actionRef = useRef<ActionType>();
    const [drawerVisit, setDrawerVisit] = useState(false);
    const optionsNoticeType = [
        { label: '邮件', value: 0},
        { label: '短信', value: 1, disabled: true},
    ];
    type LayoutType = Parameters<typeof ProForm>[0]['layout'];
    const LAYOUT_TYPE_HORIZONTAL = 'horizontal';
    const [formLayoutType, setFormLayoutType] = useState<LayoutType>(LAYOUT_TYPE_HORIZONTAL);

    const formItemLayout =
        formLayoutType === LAYOUT_TYPE_HORIZONTAL
            ? {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
            }
            : null;
    return (
        <>
            <DrawerForm
                onVisibleChange={setDrawerVisit}
                title="新建通知策略"
                visible={drawerVisit}
                {...formItemLayout}
                layout={formLayoutType}
                submitter={{
                    render: (props, doms) => {
                        return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
                            <Row>
                                <Col span={14} offset={4}>
                                    <Space>{doms}</Space>
                                </Col>
                            </Row>
                        ) : (
                            doms
                        );
                    },
                }}
                onFinish={async () => {
                    message.success('提交成功');
                    return true;
                }}
            >
                <ProFormCheckbox.Group
                    options={optionsNoticeType}
                    width="md"
                    name="notice_type"
                    label="通知类型"
                />
                <ProFormText width="sm" name="company" label="通知时间" placeholder="请输入天数" addonBefore="证书到期前提前" addonAfter="天通知" required={true}/>
                <ProFormRadio.Group
                    name="radio"
                    label="是否启用"
                    options={[
                        {
                            label: '是',
                            value: 1,
                        },
                        {
                            label: '否',
                            value: 0,
                        },
                    ]}
                />
            </DrawerForm>
            <ProTable<StrategyItem>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params = {}, sort, filter) => {
                    console.log(sort, filter);
                    return request<{
                        data: StrategyItem[];
                    }>('http://127.0.0.1:30975/notice_strategy', {
                        params,
                    });
                }}
                editable={{
                    type: 'multiple',
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                }}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                }}
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 5,
                }}
                dateFormatter="string"
                headerTitle=""
                options={false}
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => {
                        setDrawerVisit(true);
                    }}>
                        新建
                    </Button>,
                ]}
            />
        </>
    );
};
