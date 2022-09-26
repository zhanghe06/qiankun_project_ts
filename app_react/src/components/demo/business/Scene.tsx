import React, { useRef, useState } from 'react';
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
import { Modal, Button, Descriptions, message, Space, Row, Col } from 'antd';
import moment from 'moment';
import { DrawerForm, ProFormInstance, ProFormSelect, ProFormSwitch, ProFormText, ProFormDependency } from "@ant-design/pro-form";

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState<Item>();
  const [recordId, setRecordId] = useState<number>(0);
  const [drawerVisit, setDrawerVisit] = useState(false);

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
    // console.log(record);
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
    // group: number;
    segment: number;
    code: string;
    name: string;
    show_detail_st: boolean;
    level: number;
    created_at: number;
    deleted_at?: number;
  };

  const columns: ProColumns<Item>[] = [
    // {
    //   title: '业务分组',
    //   dataIndex: 'group',
    //   initialValue: '0',
    //   ellipsis: true,
    //   valueType: 'select',
    //   valueEnum: {
    //     0: {
    //       text: '全部分组',
    //     },
    //     1: {
    //       text: '采购管理',
    //     },
    //     2: {
    //       text: '销售管理',
    //     },
    //   },
    // },
    {
      title: '业务分类',
      dataIndex: 'segment',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部分类',
        },
        1: {
          text: '采购',
        },
        2: {
          text: '销售',
        },
      },
    },
    {
      title: '场景编号',
      dataIndex: 'code',
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: '场景名称',
      dataIndex: 'name',
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: '业务场景',
      ellipsis: true,
      render: (dom, record) => (
        <>
          {record.code}<br/>{record.name}
        </>
      ),
    },
    {
      title: '明细级别',
      dataIndex: 'level',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '-',
        },
        1: {
          text: '供应商',
        },
        2: {
          text: '客户',
        },
      },
      hideInSearch: true
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

  const groups = [
    { label: '采购管理', value: 1 },
    { label: '销售管理', value: 2 },
  ]

  const groupsMap = new Map()
  for (const item of groups) {
    groupsMap.set(item.value, item.label)
  }

  const segments = [
    { label: '采购', value: 1 },
    { label: '销售', value: 2 },
  ]

  const segmentsMap = new Map()
  for (const item of segments) {
    segmentsMap.set(item.value, item.label)
  }

  const levels = [
    // { label: '-', value: 0 },
    { label: '供应商', value: 1 },
    { label: '客户', value: 2 },
  ]

  const levelsMap = new Map()
  for (const item of levels) {
    levelsMap.set(item.value, item.label)
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
                // group: 1,
                segment: 1,
                code: 'scene_purchase_to_pay',
                name: `采购到付款`,
                show_detail_st: true,
                level: 1,
                created_at: 1602572994055,
              },
              {
                id: 2,
                // group: 1,
                segment: 1,
                code: 'scene_purchase_to_storage',
                name: `采购到入库`,
                show_detail_st: false,
                level: 0,
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
          {/*<Descriptions.Item label="业务分组">*/}
          {/*  {groupsMap.get(info?.group)}*/}
          {/*</Descriptions.Item>*/}
          <Descriptions.Item label="业务分类">
            {segmentsMap.get(info?.segment)}
          </Descriptions.Item>
          <Descriptions.Item label="场景编号">
            {info?.code}
          </Descriptions.Item>
          <Descriptions.Item label="场景名称">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="明细级别">
            {levelsMap.get(info?.level) || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {info?.created_at ? moment(info?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <DrawerForm<{
        id?: number
        group: number
        segment: number
        code: string
        name: string
        show_detail_st: boolean
        level: number
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
        {/*<ProFormSelect*/}
        {/*  width="sm"*/}
        {/*  name="group"*/}
        {/*  label="业务分组"*/}
        {/*  fieldProps={{*/}
        {/*    labelInValue: true,*/}
        {/*  }}*/}
        {/*  request={async () => groups}*/}
        {/*  placeholder="请选择分组"*/}
        {/*  rules={[{ required: true, message: '请选择分组!' }]}*/}
        {/*/>*/}
        <ProFormSelect
          width="sm"
          name="segment"
          label="业务分类"
          fieldProps={{
            labelInValue: true,
          }}
          request={async () => segments}
          placeholder="请选择分类"
          rules={[{ required: true, message: '请选择分类!' }]}
        />
        <ProFormText
          width="sm"
          name="code"
          label="场景编号"
          placeholder="请输入场景编号"
          rules={[{ required: true, message: '请输入场景编号!' }]}
        />
        <ProFormText
          width="sm"
          name="name"
          label="场景名称"
          placeholder="请输入场景名称"
          rules={[{ required: true, message: '请输入场景名称!' }]}
        />
        <ProFormSwitch
          width="sm"
          name="show_detail_st"
          label="展示明细"
          initialValue={false}
          rules={[{ required: true, message: '请选择状态!' }]}
        />
        <ProFormDependency name={['show_detail_st']}>
          {({ show_detail_st }) => {
            if (show_detail_st === false) {
              return
            }
            return (
              <ProFormSelect
                width="sm"
                name="level"
                label="明细级别"
                fieldProps={{
                  labelInValue: true,
                }}
                request={async () => [{ label: '请选择级别', value: 0 }].concat(...levels)}
                placeholder="请选择级别"
                rules={[{ required: true, message: '请选择级别!' }]}
              />
            );
          }}
        </ProFormDependency>
      </DrawerForm>
    </>
  );
};
