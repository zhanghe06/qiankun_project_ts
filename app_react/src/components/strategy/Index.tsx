import React, {useRef, useState} from 'react';
import {DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, FormOutlined, PlusOutlined} from '@ant-design/icons';
import {Modal, Button, Row, Col, Space, message, Descriptions} from 'antd';
import type {ProColumns, ActionType} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
    DrawerForm,
    ProFormCheckbox,
    ProFormRadio,
    ProFormText,
    ProFormDigit,
    ProFormInstance,
} from '@ant-design/pro-form';
import moment from 'moment';
import 'moment/locale/zh-cn'
import StrategyService from '../../api/strategy'


moment.locale('zh-cn');


export default () => {
    const strategyTableRef = useRef<ActionType>();
    const formRef = useRef<ProFormInstance>();
    const [drawerVisit, setDrawerVisit] = useState(false);

    const [isStrategyInfoVisible, setIsStrategyInfoVisible] = useState(false);
    const [strategyId, setStrategyId] = useState<number>(0);
    const [strategyInfo, setStrategyInfo] = useState<StrategyItem>();

    const showStrategyInfo = (record: StrategyItem) => {
        setIsStrategyInfoVisible(true);
        setStrategyInfo(record);
    };

    const onStrategyFromChange = (visible: boolean) => {
        if (!visible) {
            setStrategyId(0);
            formRef.current?.resetFields();
        }
        setDrawerVisit(visible);
    }

    const editStrategyInfo = (record: StrategyItem) => {
        setStrategyId(record.id);
        // console.log(record);
        // console.log(formRef.current);
        formRef.current?.setFieldsValue(record);
        // setTimeout(() => {formRef.current?.setFieldsValue(record)}, 0)
        setDrawerVisit(true);
    }

    const delStrategyInfo = (record: StrategyItem) => {
        if ( record.enabled_state === 1 ) {
            Modal.confirm({
                title: '启用中的策略不允许删除！',
                icon: <ExclamationCircleOutlined />,
                content: '',
                okText: '确认',
                cancelText: '取消',
                getContainer: document.querySelector('#root-app-react') as any,
            });
        } else {
            Modal.confirm({
                title: '确定删除选中的策略吗？',
                icon: <ExclamationCircleOutlined />,
                content: '',
                okText: '确认',
                cancelText: '取消',
                getContainer: document.querySelector('#root-app-react') as any,
                onOk: () => {
                    console.log(record)
                    const res = StrategyService.delete(record.id)
                    console.log(res)
                    res.then(() => {
                        return message.success('删除成功');
                    });
                    res.catch((e) => {
                        console.log(e)
                        return message.error('删除失败');
                    });
                    strategyTableRef.current?.reload();
                }
            });
        }
    }

    const handleOk = () => {
        setIsStrategyInfoVisible(false);
    };

    const handleCancel = () => {
        setIsStrategyInfoVisible(false);
    };

    const optionsNoticeType = [
        { label: '邮件', value: 0},
        { label: '短信', value: 1, disabled: true},
    ];

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

    const strategyColumns: ProColumns<StrategyItem>[] = [
        {
            title: '通知类型',
            dataIndex: 'notice_type',
            valueType: 'select',
            valueEnum: {
                0: {
                    text: '邮件',
                },
                1: {
                    text: '短信',
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
            ellipsis: true,
            valueType: 'select',
            valueEnum: {
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
            sorter: false,
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
                <a onClick={() => showStrategyInfo(record)} key="show">
                    <EyeOutlined />查看
                </a>,
                <a onClick={() => editStrategyInfo(record)} key="edit">
                    <FormOutlined />编辑
                </a>,
                <a onClick={() => delStrategyInfo(record)} key="del">
                    <DeleteOutlined />删除
                </a>,
            ],
        },
    ];
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
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
                name="strategyForm"
                onVisibleChange={onStrategyFromChange}
                title={strategyId?"编辑通知策略":"新建通知策略"}
                formRef={formRef}
                drawerProps={
                    {
                        forceRender: true,
                        // getContainer: false, // 全局设置 ConfigProvider getPopupContainer 即可
                    }
                }
                visible={drawerVisit}
                {...formItemLayout}
                layout="horizontal"
                submitter={{
                    render: (props, doms) => {
                        return (
                            <Row>
                                <Col span={12}>
                                    <Space>{doms}</Space>
                                </Col>
                            </Row>
                        );
                    },
                }}
                onFinish={async (values) => {
                    if (strategyId) {
                        const res = await StrategyService.update(values, strategyId)
                        console.log(values)
                        console.log(res)
                        message.success('编辑成功');
                        strategyTableRef.current?.reload();
                        return true;
                    } else {
                        const res = await StrategyService.create(values)
                        console.log(values)
                        console.log(res)
                        message.success('创建成功');
                        strategyTableRef.current?.reload();
                        return true;
                    }

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
                columns={strategyColumns}
                actionRef={strategyTableRef}
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
                    persistenceKey: 'pro-table-strategy',
                    persistenceType: 'localStorage',
                }}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                }}
                form={{
                    // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
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
            <Modal
                title="策略详情"
                visible={isStrategyInfoVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Descriptions
                    title=""
                    column={1}
                    labelStyle={{justifyContent: 'flex-start', minWidth: 100}}
                >
                    <Descriptions.Item label="通知类型">{strategyInfo?.notice_type === 0 ? "邮件" : "短信"}</Descriptions.Item>
                    <Descriptions.Item label="策略状态">{strategyInfo?.enabled_state === 0 ? "停用" : "启用"}</Descriptions.Item>
                    <Descriptions.Item label="通知账号">{strategyInfo?.to_emails}</Descriptions.Item>
                    <Descriptions.Item label="创建日期">{strategyInfo?.created_at ? moment(strategyInfo?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="创建人">{strategyInfo?.created_by}</Descriptions.Item>
                    <Descriptions.Item label="修改日期">{strategyInfo?.updated_at ? moment(strategyInfo?.updated_at).format('YYYY-MM-DD HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="修改人">{strategyInfo?.updated_by}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
};
