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
import { Modal, Button, Descriptions, message, Space, Row, Col, Switch, Card, Tree } from 'antd';
import moment from 'moment';
import {
  DrawerForm,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormList,
  ProFormCascader
} from "@ant-design/pro-form";
import type { DataNode } from 'antd/es/tree';

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
    code: string;
    name: string;
    tree: {variant_type: number, variant: number}[];
    created_at: number;
    deleted_at?: number;
  };

  const columns: ProColumns<Item>[] = [
    {
      title: '目录编号',
      dataIndex: 'code',
      ellipsis: true,
    },
    {
      title: '目录名称',
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

  interface Option {
    value: string | number;
    label: string;
    children?: Option[];
  }

  const options: Option[] = [
    {
      value: 1,
      label: '时间变式',
      children: [
        {
          value: 1,
          label: '季度变式',
          children: [],
        },
        {
          value: 2,
          label: '年度变式',
          children: [],
        },
      ],
    },
    {
      value: 2,
      label: '组织变式',
      children: [
        {
          value: 1,
          label: '总公司变式',
          children: [],
        },
        {
          value: 2,
          label: '分公司变式',
          children: [],
        },
      ],
    },
    {
      value: 3,
      label: '流程变式',
      children: [
        {
          value: 1,
          label: '采购流程变式',
          children: [],
        },
        {
          value: 2,
          label: '销售流程变式',
          children: [],
        },
      ],
    },
  ];

  const treeData01: DataNode[] = [
    {
      title: '2020',
      key: '0-0',
      children: [
        {
          title: '上海研发',
          key: '0-0-0',
          children: [
            { title: '采购询价', key: '0-0-0-0' },
            { title: '采购订单', key: '0-0-0-1' },
            { title: '采购入库', key: '0-0-0-2' },
            { title: '进项发票', key: '0-0-0-3' },
          ],
        },
        {
          title: '成都客服',
          key: '0-0-1',
          children: [
            { title: '采购询价', key: '0-0-1-0' },
            { title: '采购订单', key: '0-0-1-1' },
            { title: '采购入库', key: '0-0-1-2' },
            { title: '进项发票', key: '0-0-1-3' },
          ],
        },
      ],
    },
    {
      title: '2021',
      key: '1-0',
      children: [
        {
          title: '上海研发',
          key: '1-0-0',
          children: [
            { title: '采购询价', key: '1-0-0-0' },
            { title: '采购订单', key: '1-0-0-1' },
            { title: '采购入库', key: '1-0-0-2' },
            { title: '进项发票', key: '1-0-0-3' },
          ],
        },
        {
          title: '成都客服',
          key: '1-0-1',
          children: [
            { title: '采购询价', key: '1-0-1-0' },
            { title: '采购订单', key: '1-0-1-1' },
            { title: '采购入库', key: '1-0-1-2' },
            { title: '进项发票', key: '1-0-1-3' },
          ],
        },
      ],
    },
  ];

  const treeData02: DataNode[] = [
    {
      title: '2020',
      key: '0-0',
      children: [
        {
          title: '第一季度',
          key: '0-0-0',
          children: [
            { title: '采购询价', key: '0-0-0-0' },
            { title: '采购订单', key: '0-0-0-1' },
            { title: '采购入库', key: '0-0-0-2' },
            { title: '进项发票', key: '0-0-0-3' },
          ],
        },
        {
          title: '第二季度',
          key: '0-0-1',
          children: [
            { title: '采购询价', key: '0-0-1-0' },
            { title: '采购订单', key: '0-0-1-1' },
            { title: '采购入库', key: '0-0-1-2' },
            { title: '进项发票', key: '0-0-1-3' },
          ],
        },
        {
          title: '第三季度',
          key: '0-0-2',
          children: [
            { title: '采购询价', key: '0-0-2-0' },
            { title: '采购订单', key: '0-0-2-1' },
            { title: '采购入库', key: '0-0-2-2' },
            { title: '进项发票', key: '0-0-2-3' },
          ],
        },
        {
          title: '第四季度',
          key: '0-0-3',
          children: [
            { title: '采购询价', key: '0-0-3-0' },
            { title: '采购订单', key: '0-0-3-1' },
            { title: '采购入库', key: '0-0-3-2' },
            { title: '进项发票', key: '0-0-3-3' },
          ],
        },
      ],
    },
    {
      title: '2021',
      key: '1-0',
      children: [
        {
          title: '第一季度',
          key: '1-0-0',
          children: [
            { title: '采购询价', key: '1-0-0-0' },
            { title: '采购订单', key: '1-0-0-1' },
            { title: '采购入库', key: '1-0-0-2' },
            { title: '进项发票', key: '1-0-0-3' },
          ],
        },
        {
          title: '第二季度',
          key: '1-0-1',
          children: [
            { title: '采购询价', key: '1-0-1-0' },
            { title: '采购订单', key: '1-0-1-1' },
            { title: '采购入库', key: '1-0-1-2' },
            { title: '进项发票', key: '1-0-1-3' },
          ],
        },
        {
          title: '第三季度',
          key: '1-0-2',
          children: [
            { title: '采购询价', key: '1-0-2-0' },
            { title: '采购订单', key: '1-0-2-1' },
            { title: '采购入库', key: '1-0-2-2' },
            { title: '进项发票', key: '1-0-2-3' },
          ],
        },
        {
          title: '第四季度',
          key: '1-0-3',
          children: [
            { title: '采购询价', key: '1-0-3-0' },
            { title: '采购订单', key: '1-0-3-1' },
            { title: '采购入库', key: '1-0-3-2' },
            { title: '进项发票', key: '1-0-3-3' },
          ],
        },
      ],
    },
  ];

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 12},
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
                code: 'v_tree_year_branch_purchase',
                name: '年度分公司采购目录',
                tree: [
                  {variant_type:1, variant: 2, tree_node: [1, 2]},
                  {variant_type:2, variant: 1, tree_node: [2, 2]},
                  {variant_type:3, variant: 1, tree_node: [3, 1]},
                ],
                created_at: 1602572994055,
              },
              {
                id: 2,
                code: 'v_tree_group_quarter_purchase',
                name: '总公司季度采购目录',
                tree: [
                  {variant_type:2, variant: 2, tree_node: [2, 1]},
                  {variant_type:1, variant: 1, tree_node: [1, 1]},
                  {variant_type:3, variant: 1, tree_node: [3, 1]},
                ],
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
          <Descriptions.Item label="目录编号">
            {info?.code}
          </Descriptions.Item>
          <Descriptions.Item label="目录名称">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {info?.created_at ? moment(info?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}
          </Descriptions.Item>
          <Descriptions.Item label="目录预览">
            <Tree
              showLine={true}
              defaultExpandedKeys={['0-0-0']}
              treeData={info?.id === 1 ? treeData01 : treeData02}
            />
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <DrawerForm<{
        id?: number
        name: string
        variant: number
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
        <ProFormText
          width="sm"
          name="code"
          label="变式编号"
          placeholder="请输入变式编号"
          rules={[{ required: true, message: '请填写变式编号!' }]}
        />
        <ProFormText
          width="sm"
          name="name"
          label="变式名称"
          placeholder="请输入变式名称"
          rules={[{ required: true, message: '请填写变式名称!' }]}
        />
        <ProFormList
          name="tree"
          label="目录结构"
          rules={[
            {
              validator: async (_, value) => {
                console.log(value);
                if (value && value.length > 0) {
                  return;
                }
                throw new Error('至少填写一项分部信息！');
              },
            },
          ]}
          creatorButtonProps={{
            position: 'bottom',
          }}
        >
          <ProFormCascader
            width="sm"
            name="tree_node"
            label="变式名称"
            fieldProps={{
              options: options,
            }}
            // request={async () => segments}
            placeholder="请选择变式"
            rules={[{ required: true, message: '请选择变式!' }]}
          />
        </ProFormList>
      </DrawerForm>
    </>
  );
};

// 变式类型
