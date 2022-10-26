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
import { Modal, Button, Descriptions, message, Space, Row, Col, Cascader } from 'antd';
import moment from 'moment';
import { DrawerForm, ProFormInstance, ProFormSelect, ProFormText, ProFormCascader } from "@ant-design/pro-form";

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
    group: number;
    segment: number;
    name: string;
    note: string;
    created_at: number;
    deleted_at?: number;
  };

  const columns: ProColumns<Item>[] = [
    {
      title: '服务分组',
      dataIndex: 'group',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部分组',
        },
        1: {
          text: '基础信息',
        },
        2: {
          text: '主数据',
        },
        3: {
          text: '业务数据',
        },
        4: {
          text: '元数据',
        },
      },
      hideInTable: true,
    },
    {
      title: '服务分类',
      dataIndex: 'segment',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部分类',
        },
        1: {
          text: '基础信息/货币',
        },
        2: {
          text: '基础信息/国家',
        },
      },
      hideInSearch: true,
    },
    {
      title: '服务编号',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '服务名称',
      dataIndex: 'note',
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

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 12},
  };

  interface Option {
    value: string | number;
    label: string;
    children?: Option[];
  }

  const options: Option[] = [
    {
      value: 1,
      label: '基础信息',
      children: [
        {
          value: 1,
          label: '货币',
          children: [],
        },
        {
          value: 2,
          label: '国家',
          children: [],
        },
        {
          value: 3,
          label: '地区',
          children: [],
        },
      ],
    },
    {
      value: 2,
      label: '主数据',
      children: [
        {
          value: 1,
          label: '公司',
          children: [],
        },
        {
          value: 2,
          label: '工厂',
          children: [],
        },
        {
          value: 3,
          label: '组织',
          children: [],
        },
      ],
    },
    {
      value: 3,
      label: '业务数据',
      children: [
        {
          value: 1,
          label: '采购申请',
          children: [],
        },
        {
          value: 2,
          label: '采购订单',
          children: [],
        },
      ],
    },
  ];

  const getOptionLabels = (pid: string | number, cid: string | number) => {
    const pItem = options.filter(item => item.value === pid)[0]
    const pLabel = pItem?.label
    const cItems = pItem?.children
    const cLabel = cItems?.filter(item => item.value === cid)[0]?.label
    return `${pLabel} / ${cLabel}`
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
                group: 1,
                segment: 1,
                group_segment: [1, 1],
                name: 'capp_basic_currency',
                note: '获取基础信息-货币',
                created_at: 1602572994055,
              },
              {
                id: 2,
                group: 1,
                segment: 2,
                group_segment: [1, 2],
                name: 'capp_basic_country',
                note: '获取基础信息-国家',
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
          <Descriptions.Item label="服务分类">
            {info && getOptionLabels(info?.group, info?.segment)}
          </Descriptions.Item>
          <Descriptions.Item label="服务编号">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="服务名称">
            {info?.note}
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
        group_segment: number[]
        name: string
        note: string
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
        <ProFormCascader
          width="sm"
          name="group_segment"
          label="服务分类"
          fieldProps={{
            options: options,
          }}
          // request={async () => segments}
          placeholder="请选择分类"
          rules={[{ required: true, message: '请选择分类!' }]}
        />
        <ProFormText
          width="sm"
          name="name"
          label="服务编号"
          placeholder="请输入编号"
          rules={[
            { required: true, message: '请输入编号!' },
            { pattern: /^\w+$/, message: '仅仅支持英文、数字或下划线!' },
          ]}
        />
        <ProFormText
          width="sm"
          name="note"
          label="服务名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入名称!' }]}
        />
      </DrawerForm>
    </>
  );
};
