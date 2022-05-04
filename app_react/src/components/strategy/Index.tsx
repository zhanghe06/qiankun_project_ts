import React, { useRef, useState } from 'react';
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    FormOutlined,
    PlusOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { Modal, Button, Row, Col, Space, message, Descriptions, Switch } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
    DrawerForm,
    ProFormRadio,
    ProFormText,
    ProFormDigit,
    ProFormInstance,
} from '@ant-design/pro-form';
import moment from 'moment';
import StrategyService from '../../api/strategy';
import { Key } from "antd/lib/table/interface";
import { _ } from '../../i18n';


export default () => {
    const strategyTableRef = useRef<ActionType>();
    const formRef = useRef<ProFormInstance>();
    const [drawerVisit, setDrawerVisit] = useState(false);

    const [isStrategyInfoVisible, setIsStrategyInfoVisible] = useState(false);
    const [strategyId, setStrategyId] = useState<number>(0);
    const [strategyInfo, setStrategyInfo] = useState<StrategyItem>();
    const [delButtonDisable, setDelButtonDisable] = useState(true);
    const [selectRows, setSelectRows] = useState([] as StrategyItem[]);

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
        if (record.enabled_state === 1) {
            Modal.confirm({
                title: '启用中的策略不允许删除！',
                icon: <ExclamationCircleOutlined/>,
                content: '',
                // okText: '确认',
                // cancelText: '取消',
                getContainer: document.querySelector('#root-app-react') as HTMLElement,
            });
        } else {
            Modal.confirm({
                title: '确定删除选中的策略吗？',
                icon: <ExclamationCircleOutlined/>,
                content: '',
                // okText: '确认',
                // cancelText: '取消',
                getContainer: document.querySelector('#root-app-react') as HTMLElement,
                onOk: () => {
                    console.log(record)
                    const res = StrategyService.delete(record.id)
                    console.log(res)
                    res.then(() => {
                        return message.success({
                            content: '删除成功',
                            getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')
                        });
                    });
                    res.catch((e) => {
                        console.log(e)
                        return message.error({
                            content: '删除失败',
                            getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')
                        });
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

    const onEnabledStateChange = (record: StrategyItem, checked: boolean) => {
        const res = StrategyService.update({enabled_state: checked ? 1 : 0}, record.id)
        console.log(res)
        strategyTableRef.current?.reload();
    }

    const optionsNoticeType = [
        {label: _('email'), value: 0},
        {label: _('sms'), value: 1, disabled: true},
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
                    text: _('email'),
                },
                1: {
                    text: _('sms'),
                    disabled: true,
                },
            },
        },
        {
            title: '通知时间',
            dataIndex: 'trigger_threshold',
            search: false,
            sorter: true,
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
                    text: _('disabled'),
                    status: 'Error',
                },
                1: {
                    text: _('enabled'),
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
            // search: {
            //     transform: (value) => {
            //         return {
            //             startTime: value[0],
            //             endTime: value[1],
            //         };
            //     },
            // },
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Switch checked={record.enabled_state == 1}
                        onChange={(checked: boolean, event: MouseEvent) => onEnabledStateChange(record, checked)}
                        key="switch" size="small"/>,
                <a onClick={() => showStrategyInfo(record)} key="show">
                    <EyeOutlined/>
                </a>,
                <a onClick={() => editStrategyInfo(record)} key="edit">
                    <FormOutlined/>
                </a>,
                <a onClick={() => delStrategyInfo(record)} key="del">
                    <DeleteOutlined/>
                </a>,
            ],
        },
    ];
    const formItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 12},
    };

    const onSelectChange = (selectedRowKeys: Key[], selectedRows: StrategyItem[]) => {
        setSelectRows(selectedRows)
        if (selectedRowKeys.length > 0) {
            setDelButtonDisable(false)
        } else {
            setDelButtonDisable(true)
        }
    };

    const deleteSelectRows = () => {
        Modal.confirm({
            title: '确定删除选中的策略吗？',
            icon: <ExclamationCircleOutlined/>,
            content: '',
            okText: '确认',
            cancelText: '取消',
            getContainer: document.querySelector('#root-app-react') as any,
            onOk: () => {
                const enabledCount = selectRows.reduce(
                    (pre, item) => pre + item.enabled_state,
                    0,
                )
                if (enabledCount > 0) {
                    const warnMessages = selectRows.map((item, index) => {
                        if (item.enabled_state === 1) {
                            return <Descriptions.Item label=""
                                                      key={index}>通知策略（通知类型：{item.notice_type == 0 ? _('email') : _('sms')};通知时间：提前{item.trigger_threshold}天）启用中。</Descriptions.Item>
                        }
                    })
                    Modal.warning({
                        title: '以下通知策略无法删除',
                        icon: <ExclamationCircleOutlined/>,
                        content: <Descriptions title="" column={1}>{warnMessages}</Descriptions>,
                        okText: '确定',
                        getContainer: document.querySelector('#root-app-react') as any,
                    })
                } else {
                    selectRows.forEach((item, index) => {
                        const res = StrategyService.delete(item.id)
                        res.then(() => {
                            return message.success({
                                content: '删除成功',
                                key: item.id,
                                getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')
                            });
                        });
                        res.catch((e) => {
                            console.log(e)
                            return message.error({
                                content: '删除失败',
                                key: item.id,
                                getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')
                            });
                        });
                    })
                    strategyTableRef.current?.reload();
                }
            }
        });
    }

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
                title={strategyId ? "编辑通知策略" : "新建通知策略"}
                formRef={formRef}
                drawerProps={
                    {
                        closable: false, // 取消显示标题左侧关闭按钮
                        forceRender: true,
                        // getContainer: false, // 全局设置 ConfigProvider getPopupContainer 即可
                        extra: <Space><CloseOutlined onClick={() => setDrawerVisit(false)}/></Space>
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
                        message.success({
                            content: '编辑成功',
                            getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')
                        });
                        strategyTableRef.current?.reload();
                        return true;
                    } else {
                        const res = await StrategyService.create(values)
                        console.log(values)
                        console.log(res)
                        message.success({
                            content: '创建成功',
                            getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')
                        });
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
                rowSelection={{
                    onChange: onSelectChange,
                }}
                tableAlertRender={false}
                headerTitle={
                    <Space size={12}>
                        <span>
                            <Button
                                key="add-strategy"
                                type="primary"
                                icon={<PlusOutlined/>}
                                onClick={() => {
                                    setDrawerVisit(true);
                                }}
                            >
                                {_('operation_create')}
                            </Button>
                        </span>
                        <span>
                            <Button
                                key="add-strategy"
                                type="default"
                                icon={<DeleteOutlined/>}
                                disabled={delButtonDisable}
                                onClick={() => {
                                    deleteSelectRows();
                                }}
                            >
                                {_('operation_delete')}
                            </Button>
                        </span>
                    </Space>
                }
                actionRef={strategyTableRef}
                cardBordered
                request={async (
                    // 第一个参数 params 查询表单和 params 参数的结合
                    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                    params = {},
                    sort,
                    filter,
                ) => {
                    console.log(params)
                    console.log(sort)
                    console.log(filter)
                    let sorter = "";
                    for (const sortKey in sort) {
                        sorter = [sortKey, sort[sortKey]].join(" ")
                    }
                    console.log(sorter);
                    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                    // 如果需要转化参数可以在这里进行修改
                    const {current, pageSize, ...apiParams} = params;
                    const msg = await StrategyService.getAll({
                        ...apiParams,
                        offset: pageSize && current ? (pageSize * (current - 1)) : 0,
                        limit: pageSize,
                        sorter: sorter,
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
                    syncToUrl: false // 必须为false，不然翻页会触发BUG
                    // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
                    // syncToUrl: (values, type) => {
                    //     if (type === 'get') {
                    //         return {
                    //             ...values,
                    //             // created_at: [values.startTime, values.endTime],
                    //         };
                    //     }
                    //     return values;
                    // },
                }}
                pagination={{
                    pageSize: 5,
                    showQuickJumper: true,
                }}
                dateFormatter="string"
                options={false}
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
                    <Descriptions.Item label="通知类型">{strategyInfo?.notice_type === 0 ? _('email') : _('sms')}</Descriptions.Item>
                    <Descriptions.Item
                        label="策略状态">{strategyInfo?.enabled_state === 0 ? _('disabled') : _('enabled')}</Descriptions.Item>
                    <Descriptions.Item label="通知账号">{strategyInfo?.to_emails}</Descriptions.Item>
                    <Descriptions.Item
                        label="创建日期">{strategyInfo?.created_at ? moment(strategyInfo?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="创建人">{strategyInfo?.created_by}</Descriptions.Item>
                    <Descriptions.Item
                        label="修改日期">{strategyInfo?.updated_at ? moment(strategyInfo?.updated_at).format('YYYY-MM-DD HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="修改人">{strategyInfo?.updated_by}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
};
