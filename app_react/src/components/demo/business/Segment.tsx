import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { DragSortTable } from '@ant-design/pro-table';
import {
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  CloseOutlined,
  PlusOutlined, MenuOutlined
} from '@ant-design/icons';
import { Modal, Button, Descriptions, message, Space, Row, Col } from 'antd';
import moment from 'moment';
import { DrawerForm, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-form";

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const levelFormRef = useRef<ProFormInstance>();

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState<Item>();
  const [recordId, setRecordId] = useState<number>(0);
  const [levelRecordId, setLevelRecordId] = useState<number>(0);
  const [drawerVisit, setDrawerVisit] = useState(false);
  const [levelDrawerVisit, setLevelDrawerVisit] = useState(false);

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

  const onLevelFromChange = (visible: boolean) => {
    if (!visible) {
      // setRecordId(0);
      levelFormRef.current?.resetFields();
    }
    setLevelDrawerVisit(visible);
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

  const editLevelInfo = (record: Item) => {
    setLevelRecordId(record.id);
    // console.log(record);
    // console.log(formRef.current);
    levelFormRef.current?.setFieldsValue(record);
    // setTimeout(() => {formRef.current?.setFieldsValue(record)}, 0)
    setLevelDrawerVisit(true);
  }

  type Item = {
    id: number;
    // group: number;
    name: string;
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
      title: '场景分类',
      dataIndex: 'name',
      ellipsis: true,
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
        <a onClick={() => editLevelInfo(record)} key="create">
          创建场景对象
        </a>,
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

  type levelItem = {
    id: number;
    segment: number;
    name: string;
    service: number;
    created_at: number;
    deleted_at?: number;
  };

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 12},
  };

  const dataDrag = [
    {
      key: 'key1',
      name: '供应商',
      service_name: <>capp_supplier_list<br/>供应商列表服务</>,
      index: 0,
    },
    {
      key: 'key2',
      name: '客户',
      service_name: <>capp_customer_list<br/>客户列表服务</>,
      index: 1,
    },
  ];

  const [dataSource, setDataSource] = useState(dataDrag);

  // const groups = [
  //   { label: '采购管理', value: 1 },
  //   { label: '销售管理', value: 2 },
  // ]
  //
  // const groupsMap = new Map()
  // for (const item of groups) {
  //   groupsMap.set(item.value, item.label)
  // }

  const expandedRowRender = (row: any) => {
    // console.log(row.scene)

    const handleDragSortEnd = (newDataSource: any) => {
      // console.log('排序后的数据', newDataSource);
      setDataSource(newDataSource);
      message.success('修改场景排序成功');
    };

    const dragHandleRender = (rowData: any, idx: any) => (
      <>
        <MenuOutlined style={{ cursor: 'grab', color: 'gold' }} />
        &nbsp;{idx + 1}
      </>
    );

    return (
      <DragSortTable
        headerTitle=""
        columns={[
          // {
          //   title: '排序',
          //   dataIndex: 'sort',
          // },
          {
            title: '场景对象',
            dataIndex: 'name',
            className: 'drag-visible',
          },
          {
            title: '服务名称',
            dataIndex: 'service_name',
            className: 'drag-visible',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            valueType: 'option',
            render: (text, record) => [
              <a key="edit"><FormOutlined/></a>,
              <a key="del"><DeleteOutlined/></a>
            ],
          },
        ]}
        rowKey="key"
        search={false}
        options={false}
        pagination={false}
        dataSource={dataDrag}
        dragSortKey="sort"
        dragSortHandlerRender={dragHandleRender}
        onDragSortEnd={handleDragSortEnd}
      />
    );
  };

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
                name: `生产采购`,
                created_at: 1602572994055,
              },
              {
                id: 2,
                // group: 1,
                name: `通用采购`,
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
        expandable={{ expandedRowRender }}
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
          <Descriptions.Item label="场景分类">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {info?.created_at ? moment(info?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <DrawerForm<{
        id?: number
        group: number
        name: string
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
        <ProFormText
          width="sm"
          name="name"
          label="场景分类"
          placeholder="请输入分类"
          rules={[{ required: true, message: '请输入分类!' }]}
        />
      </DrawerForm>
      <DrawerForm<{
        id?: number
        scene: number
        code: string
        name: string
        system_st: number,
        created_at?: string
      }>
        name="recordForm"
        onOpenChange={onLevelFromChange}
        title={recordId ? "编辑" : "新建"}
        formRef={levelFormRef}
        drawerProps={
          {
            closable: false, // 取消显示标题左侧关闭按钮
            forceRender: true,
            // getContainer: false, // 全局设置 ConfigProvider getPopupContainer 即可
            extra: <Space><CloseOutlined onClick={() => setDrawerVisit(false)}/></Space>
          }
        }
        open={levelDrawerVisit}
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
        <ProFormText
          width="sm"
          name="segment"
          label="场景分类"
          // fieldProps={{
          //   labelInValue: true,
          // }}
          // request={async () => segments}
          disabled={true}
          placeholder="场景分类"
          initialValue="生产采购"
          rules={[{ required: true, message: '请填写场景分类!' }]}
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
          // request={async () => services}
          placeholder="请选择服务"
          rules={[{ required: true, message: '请选择服务!' }]}
        />
      </DrawerForm>
    </>
  );
};
