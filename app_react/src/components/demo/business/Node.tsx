import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Modal, Button, Descriptions, message, Space, Row, Col, Switch, Transfer } from 'antd';
import moment from 'moment';
import { DrawerForm, ProFormInstance, ProFormSelect, ProFormSwitch, ProFormText, ProFormCheckbox } from "@ant-design/pro-form";

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState<Item>();
  const [recordId, setRecordId] = useState<number>(0);
  const [drawerVisit, setDrawerVisit] = useState(false);
  const [displayFields, setDisplayFields] = useState<{key: string, title: string}[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const showInfo = async (record: Item) => {
    setIsInfoVisible(true);
    setInfo(record);
  };

  const handleOk = () => {
    setIsInfoVisible(false);
  };

  const handleCancel = () => {
    setIsInfoVisible(false);
  };

  const onFromChange = (visible: boolean) => {
    if (!visible) {
      setRecordId(0);
      formRef.current?.resetFields();
    }
    setDrawerVisit(visible);
  }

  const editInfo = (record: Item) => {
    setRecordId(record.id);
    console.log(record);
    // console.log(formRef.current);
    formRef.current?.setFieldsValue(record);

    const pItem = options.filter(i => i.value === record.service)[0]
    const cItems = pItem?.children
    const fields = cItems?.map((i) => Object.assign(
      {
        key: i.value,
        title: i.label
      }
    ));
    setDisplayFields(fields || [])

    setTargetKeys(record.display_field);
    // setTimeout(() => {formRef.current?.setFieldsValue(record)}, 0)
    setDrawerVisit(true);
  }

  const delInfo = (record: Item) => {
    Modal.confirm({
      title: '确定删除选中的记录吗？',
      icon: <ExclamationCircleOutlined/>,
      content: '',
      // okText: '确认',
      // cancelText: '取消',
      getContainer: document.querySelector('#root-app-react') as any,
      onOk: () => {
        message.success({
          type: 'success',
          content: '删除成功',
          getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')!
        });
        tableRef.current?.reload();
      }
    });
  }

  type Item = {
    id: number;
    scene: number;
    code: string;
    name: string;
    system_st: number;
    service: number;
    display_field: string[]
    created_at: number;
    deleted_at?: number;
  };

  const columns: ProColumns<Item>[] = [
    {
      title: '业务场景',
      dataIndex: 'scene',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: <>全部场景</>,
        },
        1: {
          text: <>scene_purchase_to_pay<br/>采购到付款</>,
        },
        2: {
          text: <>scene_purchase_to_storage<br/>采购到入库</>,
        },
      },
    },
    {
      title: '业务节点',
      ellipsis: true,
      render: (dom, record) => (
        <>
          {record.code}<br/>{record.name}
        </>
      ),
      hideInSearch: true,
    },
    {
      title: '系统数据',
      dataIndex: 'system_st',
      render: (_, record) => (
        <Switch checked={record.system_st == 1} key={"switch_system_st"+record.id} size="small"/>
      ),
      hideInSearch: true,
    },
    {
      title: '服务名称',
      dataIndex: 'service',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部服务',
        },
        1: {
          text: <>capp_purchase_inquire<br/>采购询价服务</>,
        },
        2: {
          text: <>capp_purchase_order<br/>采购订单服务</>,
        },
        3: {
          text: <>capp_purchase_storage<br/>采购入库服务</>,
        },
        4: {
          text: <>capp_purchase_invoice<br/>进项发票服务</>,
        },
      },
    },
    {
      dataIndex: 'display_field',
      title: '显示字段',
      ellipsis: true,
      render: (_, record) => {
        return record.display_field && record.display_field.length > 0 ? record.display_field.join('、') : '无';
      },
    },
    // {
    //   dataIndex: 'display_field',
    //   title: '限定条件',
    //   ellipsis: true,
    //   tooltip: true,
    //   render: (_, record) => {
    //     return record.display_field && record.display_field.length > 0 ? record.display_field.join('、') : '无';
    //   },
    // },
    {
      title: '时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'right',
      valueType: 'option',
      render: (text, record) => [
        <a onClick={() => showInfo(record)} key="show">
          <EyeOutlined/>
        </a>,
        <a onClick={() => editInfo(record)} key="edit">
          <FormOutlined/>
        </a>,
        <a onClick={() => delInfo(record)} key="del">
          <DeleteOutlined/>
        </a>,
      ],
    },
  ];

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 12},
  };

  const scenes = [
    { label: '采购到付款', value: 1 },
    { label: '采购到入库', value: 2 },
  ]

  const scenesMap = new Map()
  for (const item of scenes) {
    scenesMap.set(item.value, item.label)
  }

  const services = [
    { label: <>capp_purchase_inquire<br/>采购询价服务</>, value: 1 },
    { label: <>capp_purchase_order<br/>采购订单服务</>, value: 2 },
    { label: <>capp_purchase_storage<br/>采购存储服务</>, value: 3 },
    { label: <>capp_purchase_invoice<br/>进项发票服务</>, value: 4 },
  ]

  const servicesMap = new Map()
  for (const item of services) {
    servicesMap.set(item.value, item.label)
  }

  const handleChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  interface Option {
    value: string | number;
    label: string | React.ReactNode;
    children?: Option[];
  }

  const options: Option[] = [
    {
      value: 1,
      label: '采购询价（capp_purchase_inquire）',
      children: [
        {
          value: 'amount',
          label: '询价总额',
          children: [],
        },
        {
          value: 'quantity',
          label: '询价数量',
          children: [],
        },
        {
          value: 'status',
          label: '订单状态',
          children: [],
        },
      ],
    },
    {
      value: 2,
      label: '采购订单（capp_purchase_order）',
      children: [
        {
          value: 'code',
          label: '订单编号',
          children: [],
        },
        {
          value: 'amount',
          label: '订单总额',
          children: [],
        },
        {
          value: 'status',
          label: '订单状态',
          children: [],
        },
        {
          value: 'quantity',
          label: '订单数量',
          children: [],
        },
      ],
    },
    {
      value: 3,
      label: '采购入库（capp_purchase_storage）',
      children: [
        {
          value: 'code',
          label: '入库单号',
          children: [],
        },
        {
          value: 'warehouse',
          label: '仓库地址',
          children: [],
        },
        {
          value: 'quantity',
          label: '订单数量',
          children: [],
        },
        {
          value: 'in_qty',
          label: '入库数量',
          children: [],
        },
      ],
    },
    {
      value: 4,
      label: '进项发票（capp_purchase_invoice）',
      children: [
        {
          value: 'code',
          label: '订单编号',
          children: [],
        },
        {
          value: 'amount',
          label: '订单总额',
          children: [],
        },
        {
          value: 'status',
          label: '订单状态',
          children: [],
        },
        {
          value: 'invoice',
          label: '发票编号',
          children: [],
        },
      ],
    },
  ];

  const handleServiceChange = (item: { value: number; label: React.ReactNode } | undefined) => {
    console.log(item);
    if (item == undefined) {
      setDisplayFields([])
      setTargetKeys([])
      return
    }
    const pItem = options.filter(i => i.value === item.value)[0]
    const cItems = pItem?.children
    const fields = cItems?.map((i) => Object.assign(
      {
        key: i.value,
        title: i.label
      }
    ));
    setDisplayFields(fields || [])
    setTargetKeys([])
  };

  useEffect(() => {
    formRef.current?.setFieldsValue(
      {
        display_field: targetKeys,
      }
    )
    return
  }, [targetKeys])

  return (
    <>
      <ProTable<Item>
        columns={columns}
        actionRef={tableRef}
        cardBordered
        request={async () => {
          return {
            data: [
              {
                id: 1,
                scene: 1,
                code: 'node_purchase_inquire',
                name: '采购询价',
                system_st: 0,
                service: 1,
                display_field: [],
                created_at: 1602572994055,
              },
              {
                id: 2,
                scene: 1,
                code: 'node_purchase_order',
                name: '采购订单',
                system_st: 1,
                service: 2,
                display_field: [
                  'code',
                  'amount',
                  'status',
                ],
                created_at: 1602572995055,
              },
              {
                id: 3,
                scene: 1,
                code: 'node_purchase_storage',
                name: '采购入库',
                system_st: 1,
                service: 3,
                display_field: [
                  'warehouse',
                  'quantity',
                  'in_qty',
                ],
                created_at: 1602572994055,
              },
              {
                id: 4,
                scene: 1,
                code: 'node_purchase_invoice',
                name: '采购发票',
                system_st: 1,
                service: 4,
                display_field: [
                  'invoice',
                  'code',
                  'amount',
                ],
                created_at: 1602572995055,
              },
            ],
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: 4,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        form={{
          syncToUrl: false // 必须为false，不然翻页会触发BUG
        }}
        pagination={{
          pageSize: 5,
          showQuickJumper: true,
        }}
        dateFormatter="string"
        tableAlertRender={false}
        options={false}
        headerTitle={
          <Space size={12}>
            <span>
              <Button
                key="add-record"
                type="primary"
                icon={<PlusOutlined/>}
                onClick={() => {
                  setDrawerVisit(true);
                }}
              >
                创建
              </Button>
            </span>
          </Space>
        }
      />
      <Modal
        title="详情"
        open={isInfoVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Descriptions
          title=""
          column={1}
          labelStyle={{justifyContent: 'flex-start', minWidth: 100}}
        >
          <Descriptions.Item label="业务场景">
            {scenesMap.get(info?.scene)}
          </Descriptions.Item>
          <Descriptions.Item label="节点编号">
            {info?.code}
          </Descriptions.Item>
          <Descriptions.Item label="节点名称">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="服务名称">
            {servicesMap.get(info?.service)}
          </Descriptions.Item>
          <Descriptions.Item label="显示字段">
            {info?.display_field && info?.display_field.length > 0 ? info?.display_field.join('、') : '无'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {info?.created_at ? moment(info?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <DrawerForm<{
        id?: number
        scene: number
        code: string
        name: string
        system_st: number,
        display_field: string[]
        created_at?: string
      }>
        name="recordForm"
        onOpenChange={onFromChange}
        title={recordId ? "编辑" : "新建"}
        formRef={formRef}
        drawerProps={
          {
            closable: false, // 取消显示标题左侧关闭按钮
            forceRender: true,
            // getContainer: false, // 全局设置 ConfigProvider getPopupContainer 即可
            extra: <Space><CloseOutlined onClick={() => setDrawerVisit(false)}/></Space>
          }
        }
        open={drawerVisit}
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
          if (recordId) {
            // TODO API
            message.success({
              type: 'success',
              content: '编辑成功',
              getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')!
            });
            tableRef.current?.reload();
            return true;
          } else {
            // TODO API
            message.success({
              type: 'success',
              content: '创建成功',
              getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')!
            });
            tableRef.current?.reload();
            return true;
          }
        }}
      >
        <ProFormSelect
          width="sm"
          name="scene"
          label="业务场景"
          fieldProps={{
            labelInValue: true,
          }}
          request={async () => scenes}
          placeholder="请选择场景"
          rules={[{ required: true, message: '请选择场景!' }]}
        />
        <ProFormText
          width="sm"
          name="code"
          label="节点编号"
          placeholder="请输入编号"
          rules={[{ required: true, message: '请输入编号!' }]}
        />
        <ProFormText
          width="sm"
          name="name"
          label="节点名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入名称!' }]}
        />
        <ProFormSwitch
          width="sm"
          name="system_st"
          label="系统数据"
          initialValue={1}
          rules={[{ required: true, message: '请选择状态!' }]}
        />
        <ProFormSelect
          width="sm"
          name="service"
          label="服务名称"
          fieldProps={{
            labelInValue: true,
            onChange: handleServiceChange,
            // optionItemRender(item) {
            //   return item.label + ' - ' + item.value;
            // },
          }}
          request={async () => services}
          placeholder="请选择服务"
          rules={[{ required: true, message: '请选择服务!' }]}
        />
        <ProFormCheckbox.Group
          name="display_field"
          label="显示字段"
          options={[]}
          rules={[{ required: true, message: '请选择字段!' }]}
        >
          <Transfer
            dataSource={displayFields}
            showSearch
            style={
              {
                width: 444,
              }
            }
            listStyle={
              {
                width: 222,
                height: 300,
              }
            }
            operations={['显示', '取消']}
            targetKeys={targetKeys}
            onChange={handleChange}
            render={item => `${item.title}`}
          />
        </ProFormCheckbox.Group>

      </DrawerForm>
    </>
  );
};
