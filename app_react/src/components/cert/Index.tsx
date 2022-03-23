import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import CertService from '../../api/cert'


type CertItem = {
    id: number;
    auth_id: string;
    p_version: string;
    cont_rep: string;
    serial_number: string;
    version: number;
    issuer_name: string;
    signature_algorithm: string;
    not_before: string;
    not_after: string;
    enabled_state: number;
    version_display_name: string;
    enabled_state_display_name: string;
    deleted_at?: string;
};

const columns: ProColumns<CertItem>[] = [
    {
        title: '客户端ID',
        dataIndex: 'auth_id',
        copyable: true,
        ellipsis: true,
    },
    {
        title: '接口版本',
        dataIndex: 'p_version',
    },
    {
        title: '内容仓库',
        dataIndex: 'cont_rep',
    },
    {
        title: '效期开始',
        key: 'notBefore',
        dataIndex: 'not_before',
        valueType: 'dateTime',
        hideInSearch: true,
    },
    {
        title: '效期结束',
        key: 'notAfter',
        dataIndex: 'not_after',
        valueType: 'dateTime',
        hideInSearch: true,
    },
    {
        title: '效期开始',
        dataIndex: 'not_before',
        valueType: 'dateRange',
        hideInTable: true,
        search: {
            transform: (value) => {
                return {
                    not_before_start_time: value[0],
                    not_before_end_time: value[1],
                };
            },
        },
    },
    {
        title: '效期结束',
        dataIndex: 'not_after',
        valueType: 'dateRange',
        hideInTable: true,
        search: {
            transform: (value) => {
                return {
                    not_after_start_time: value[0],
                    not_after_end_time: value[1],
                };
            },
        },
    },
    {
        title: '证书状态',
        dataIndex: 'enabled_state',
        valueType: 'select',
        valueEnum: {
            '': { text: '全部状态', status: 'Default' },
            1: {
                text: '启用',
                status: 'Success',
            },
            0: {
                text: '停用',
                status: 'Error',
            }
        },
    },
    {
        title: '操作',
        valueType: 'option',
        render: (text, record, _, action) => [
            <a href="" target="_blank" rel="noopener noreferrer" key="view">
                查看
            </a>,
            <TableDropdown
                key="actionGroup"
                onSelect={() => action?.reload()}
                menus={[
                    { key: 'copy', name: '复制' },
                    { key: 'delete', name: '删除' },
                ]}
            />,
        ],
    },
];


export default () => {
    const actionRef = useRef<ActionType>();
    return (
        <ProTable<CertItem>
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
                const msg = await CertService.getAll({
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
            toolBarRender={false}
        />
    );
};
