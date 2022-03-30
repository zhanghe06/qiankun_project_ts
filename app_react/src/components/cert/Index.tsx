import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Modal, Button, Descriptions } from 'antd';
import CertService from '../../api/cert'


export default () => {
    const actionRef = useRef<ActionType>();

    const [isCertInfoVisible, setIsCertInfoVisible] = useState(false);
    const [certInfo, setCertInfo] = useState<CertItem>();

    const showCertInfo = (record: CertItem) => {
        setIsCertInfoVisible(true);
        setCertInfo(record);
    };

    const handleOk = () => {
        setIsCertInfoVisible(false);
    };

    const handleCancel = () => {
        setIsCertInfoVisible(false);
    };

    const delCertInfo = (record: CertItem) => {
        console.log(record)
        const res = CertService.delete(record.id)
        console.log(res)
    }

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
        cert_content?: string;
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
                <Button type="primary" onClick={() => showCertInfo(record)}>
                    查看
                </Button>,
                <Button type="default" onClick={() => delCertInfo(record)}>
                    删除
                </Button>,
            ],
        },
    ];

    return (
        <>
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
            <Modal
                title="证书详情"
                visible={isCertInfoVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Descriptions title="" column={1}>
                    <Descriptions.Item label="客户端ID">{certInfo ? certInfo.auth_id : ""}</Descriptions.Item>
                    <Descriptions.Item label="接口版本">{certInfo ? certInfo.p_version : ""}</Descriptions.Item>
                    <Descriptions.Item label="内容仓库">{certInfo ? certInfo.cont_rep : ""}</Descriptions.Item>
                    <Descriptions.Item label="效期开始时间">{certInfo ? certInfo.not_before : ""}</Descriptions.Item>
                    <Descriptions.Item label="效期结束时间">{certInfo ? certInfo.not_after : ""}</Descriptions.Item>
                    <Descriptions.Item label="证书内容">{certInfo ? certInfo.cert_content : ""}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
};
