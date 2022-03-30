import React, {useRef, useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Row, Col, Space, message} from 'antd';
import type {ProColumns, ActionType} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, {
    DrawerForm,
    ProFormCheckbox,
    ProFormRadio,
    ProFormText,
    ProFormDigit,
} from '@ant-design/pro-form';
import StrategyService from '../../api/strategy'

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
            '': { text: '全部类型', status: 'Default', default: true },
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

    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };
    return (
        <>
            <DrawerForm<{
                id?: number
                notice_type: number
                trigger_threshold: number
                to_emails: string
                enabled_state: number
                created_at?: string
            }>
                onVisibleChange={setDrawerVisit}
                title="新建通知策略"
                visible={drawerVisit}
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
                    const res = await StrategyService.create(values)
                    console.log(values)
                    console.log(res)
                    message.success('提交成功');
                    return true;
                }}
            >
                <ProFormRadio.Group
                    options={optionsNoticeType}
                    width="md"
                    name="notice_type"
                    label="通知类型"
                />
                <ProFormDigit
                    width="sm"
                    name="trigger_threshold"
                    label="通知时间"
                    placeholder="请输入天数"
                    addonBefore="证书到期前提前"
                    addonAfter="天通知"
                    required={true}
                />
                <ProFormText
                    width="sm"
                    name="to_emails"
                    label="通知账号"
                    placeholder="请输入通知账号"
                    tooltip="输入通知账号，添加后，对方将收到邮件通知"
                />
                <ProFormRadio.Group
                    name="enabled_state"
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
                request={async (
                    // 第一个参数 params 查询表单和 params 参数的结合
                    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                    params = {},
                    sort,
                    filter,
                ) => {
                    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                    // 如果需要转化参数可以在这里进行修改
                    const msg = await StrategyService.getAll({
                        ...params,
                        offset: params.pageSize && params.current ? (params.pageSize * (params.current - 1)) : 0,
                        limit: params.pageSize,
                    });
                    // const msg = await CertService.getAll({...params});
                    return {
                        data: msg.data.entries,
                        // success 请返回 true，
                        // 不然 table 会停止解析数据，即使有数据
                        success: true,
                        // 不传会使用 data 的长度，如果是分页一定要传
                        total: msg.data.total_count,
                    };
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
