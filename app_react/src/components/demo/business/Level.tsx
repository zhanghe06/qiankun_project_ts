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
    segment: number;
    name: string;
    service: number;
    created_at: number;
    deleted_at?: number;
  };

  const columns: ProColumns<Item>[] = [
    {
      title: '场景分类',
      dataIndex: 'segment',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部分类',
        },
        1: {
          text: '生产采购',
        },
        2: {
          text: '通用采购',
        },
      },
    },
    {
      title: '场景对象',
      dataIndex: 'name',
      ellipsis: true,
      tooltip: '目录树会动态展示该级别',
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
          text: <>capp_supplier_list<br/>供应商列表服务</>,
        },
        2: {
          text: <>capp_customer_list<br/>客户列表服务</>,
        },
      },
    },
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
    { label: <>capp_supplier_list<br/>供应商列表服务</>, value: 1 },
    { label: <>capp_customer_list<br/>客户列表服务</>, value: 2 },
  ]

  const servicesMap = new Map()
  for (const item of services) {
    servicesMap.set(item.value, item.label)
  }

  const segments = [
    { label: '采购', value: 1 },
    { label: '销售', value: 2 },
  ]

  const segmentsMap = new Map()
  for (const item of segments) {
    segmentsMap.set(item.value, item.label)
  }

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
                segment: 1,
                scene: 1,
                name: '供应商',
                system_st: 0,
                service: 1,
                created_at: 1602572994055,
              },
              {
                id: 2,
                segment: 1,
                scene: 1,
                name: '客户',
                system_st: 1,
                service: 2,
                created_at: 1602572995055,
              },
            ],
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: 2,
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
          <Descriptions.Item label="场景分类">
            {segmentsMap.get(info?.segment)}
          </Descriptions.Item>
          <Descriptions.Item label="场景对象">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="服务名称">
            {servicesMap.get(info?.service)}
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
          name="segment"
          label="场景分类"
          fieldProps={{
            labelInValue: true,
          }}
          request={async () => segments}
          placeholder="请选择分类"
          rules={[{ required: true, message: '请选择分类!' }]}
        />
        <ProFormText
          width="sm"
          name="name"
          label="场景对象"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入名称!' }]}
        />
        <ProFormSelect
          width="sm"
          name="service"
          label="服务名称"
          fieldProps={{
            labelInValue: true,
            optionItemRender(item) {
              return <>{item.label}</>;
            },
          }}
          request={async () => services}
          placeholder="请选择服务"
          rules={[{ required: true, message: '请选择服务!' }]}
        />
      </DrawerForm>
    </>
  );
};
