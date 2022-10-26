import React, { useRef, useState } from 'react';
import {
  AppstoreOutlined, CloseOutlined, DeleteOutlined, ExclamationCircleOutlined,
  EyeOutlined,
  FormOutlined,
  MailOutlined,
  PlusOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu, Space, Layout, Row, Col, message, Modal } from 'antd';
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { DrawerForm, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-form";
const { Header, Content, Sider } = Layout;

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const items = [
    {
      label: '基础信息',
      key: 'basic',
      icon: <MailOutlined />,
      children: [
        {
          label: '物料',
          key: 'basic_01',
        },
        {
          label: '国家',
          key: 'basic_02',
        },
      ],
    },
    {
      label: '主数据',
      key: 'main',
      icon: <MailOutlined />,
      children: [
        {
          label: '采购组织',
          key: 'main_01',
        },
        {
          label: '公司代码',
          key: 'main_02',
        },
      ],
    },
    {
      label: '业务数据',
      key: 'business',
      icon: <MailOutlined />,
      children: [
        {
          label: '采购',
          key: 'business_01',
        },
        {
          label: '销售',
          key: 'business_02',
        },
      ],
    },
    {
      label: '元数据',
      key: 'metadata',
      icon: <MailOutlined />,
      children: [
        {
          label: '文档',
          key: 'metadata_01',
        },
      ],
    },
  ];
  // return <Menu items={items} />;

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
    group: string;
    segment: string;
    name: string;
    note: string;
    created_at: number;
    deleted_at?: number;
  };

  const columns: ProColumns<Item>[] = [
    {
      title: '业务组类型',
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
    },
    {
      title: '业务组名称',
      dataIndex: 'segment',
      ellipsis: true,
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
  ];

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 12},
  };

  return (
    <Layout style={{background: '#fff'}}>
      <Sider width={256} style={{background: '#fff'}}>
        <Menu
          // onClick={onClick}
          style={{ width: 256 }}
          defaultSelectedKeys={['business_01']}
          defaultOpenKeys={['business']}
          mode="inline"
          items={items}
        />
      </Sider>
      <Content style={{marginLeft: 15}}>
        <ProTable<Item>
          columns={columns}
          // actionRef={tableRef}
          cardBordered
          request={async () => {
            return {
              data: [
                {
                  id: 1,
                  group: '业务数据',
                  segment: '采购',
                  name: 'capp_business_purchase_apply',
                  note: '采购申请服务',
                  created_at: 1602572994055,
                },
                {
                  id: 2,
                  group: '业务数据',
                  segment: '采购',
                  name: 'capp_business_purchase_order',
                  note: '采购订单服务',
                  created_at: 1602572995055,
                },
              ],
              success: true,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: 2,
            };
          }}
          rowKey="id"
          search={false}
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
                onClick={() => {
                  message.info({
                    type: 'info',
                    content: '开发中...',
                    getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')!
                  });
                }}
              >
                权限配置
              </Button>
            </span>
              <span>
              <Button
                key="add-record"
                type="primary"
                onClick={() => {
                  message.info({
                    type: 'info',
                    content: '开发中...',
                    getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')!
                  });
                }}
              >
                元数据配置
              </Button>
            </span>
            </Space>
          }
        />
      </Content>
    </Layout>
  );
};
