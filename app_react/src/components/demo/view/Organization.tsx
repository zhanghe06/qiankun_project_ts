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
import { Modal, Button, Descriptions, message, Space, Row, Col, Switch, Card, Divider } from 'antd';
import moment from 'moment';
import { ProForm, DrawerForm, ProFormInstance, ProFormSelect, ProFormSwitch, ProFormText, ProFormList, ProFormDependency } from "@ant-design/pro-form";

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState<Item>();
  const [recordId, setRecordId] = useState<number>(0);
  const [orgBranchVisit, setOrgBranchVisit] = useState(false);
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

  const handleFormVisibleChange = (visible: boolean) => {
    if (!visible) {
      setRecordId(0);
      formRef.current?.resetFields();
    }
    setDrawerVisit(visible);
  }

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    console.log(changedValues.enabled_branch)
    if (changedValues.enabled_branch !== undefined) {
      if (changedValues.enabled_branch === true) {
        setOrgBranchVisit(true)
      } else {
        setOrgBranchVisit(false)
      }
    }
  }

  const editInfo = (record: Item) => {
    setRecordId(record.id);
    // console.log(record);
    // console.log(formRef.current);
    formRef.current?.setFieldsValue(record);
    // setTimeout(() => {formRef.current?.setFieldsValue(record)}, 0)
    if (record.enabled_branch === 1) {
      setOrgBranchVisit(true)
    } else {
      setOrgBranchVisit(false)
    }
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
    org_code: string;
    org_name: string;
    org_short_name: string;
    enabled_branch: number;
    created_at: number;
    deleted_at?: number;
  };

  const columns: ProColumns<Item>[] = [
    {
      title: '变式编号',
      dataIndex: 'code',
      ellipsis: true,
    },
    {
      title: '变式名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '公司代码',
      dataIndex: 'org_code',
      ellipsis: true,
    },
    {
      title: '公司名称',
      dataIndex: 'org_name',
      ellipsis: true,
    },
    {
      title: '公司简称',
      dataIndex: 'org_short_name',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '启用分公司',
      dataIndex: 'enabled_branch',
      render: (_, record) => (
        <Switch checked={record.enabled_branch == 1} key={"enabled_branch"+record.enabled_branch} size="small"/>
      ),
      hideInSearch: true,
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
                code: 'v_org_group',
                name: '总公司变式',
                org_code: 'AISHU',
                org_name: '上海爱数信息技术股份有限公司',
                org_short_name: '爱数',
                enabled_branch: 0,
                created_at: 1602572994055,
              },
              {
                id: 2,
                code: 'v_org_branch',
                name: '分公司变式',
                org_code: 'AISHU',
                org_name: '上海爱数信息技术股份有限公司',
                org_short_name: '爱数',
                enabled_branch: 1,
                org_branches: [
                  {
                    org_branch_name: '上海研发中心',
                    org_branch_short_name: '上海研发',
                  },
                  {
                    org_branch_name: '成都客服中心',
                    org_branch_short_name: '成都客服',
                  },
                  {
                    org_branch_name: '北京销售中心',
                    org_branch_short_name: '北京销售',
                  },
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
          <Descriptions.Item label="变式名称">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="公司代码">
            {info?.org_code}
          </Descriptions.Item>
          <Descriptions.Item label="公司名称">
            {info?.org_name}
          </Descriptions.Item>
          <Descriptions.Item label="公司简称">
            {info?.org_short_name}
          </Descriptions.Item>
          <Descriptions.Item label="启用分部">
            {info?.enabled_branch === 1 ? '启用' : '无'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {info?.created_at ? moment(info?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <DrawerForm<{
        id?: number
        org_code: string
        org_name: string
        org_short_name: string
        org_branches?: {
          org_branch_name: string;
          org_branch_short_name: string;
        }[]
        created_at?: string
      }>
        name="recordForm"
        onOpenChange={handleFormVisibleChange}
        onValuesChange={handleFormValuesChange}
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
        <ProFormText
          width="sm"
          name="org_name"
          label="公司名称"
          placeholder="请选择公司名称"
          initialValue={'上海爱数信息技术股份有限公司'}
          disabled={true}
          rules={[{ required: true, message: '请选择公司名称!' }]}
        />
        <ProFormText
          width="sm"
          name="org_short_name"
          label="公司简称"
          placeholder="请输入公司简称"
          rules={[{ required: true, message: '请填写公司简称!' }]}
        />
        <ProFormSwitch
          width="sm"
          name="enabled_branch"
          label="启用分部"
        />
        <ProFormDependency name={['enabled_branch']}>
          {() => {
            if (!orgBranchVisit) {
              return
            }
            return (
              <ProFormList
                name="org_branches"
                label="分部信息"
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
                creatorButtonProps={false}
                // creatorButtonProps={{
                //   position: 'bottom',
                // }}
                initialValue={[
                  {
                    org_branch_name: '成都客服中心',
                  },
                  {
                    org_branch_name: '上海研发中心',
                  },
                  {
                    org_branch_name: '北京销售中心',
                  },
                ]}
                itemContainerRender={(doms) => {
                  return <ProForm.Group>{doms}</ProForm.Group>;
                }}
                {...{
                  labelCol: {span: 4},
                  wrapperCol: {span: 16},
                }}
              >
                <ProFormText
                  width="sm"
                  key="org_branch_name"
                  name="org_branch_name"
                  // label="名称"
                  placeholder="请选择分部名称"
                  disabled={true}
                  rules={[{ required: true, message: '请填写分部名称!' }]}
                />
                <ProFormText
                  width="xs"
                  key="org_branch_short_name"
                  name="org_branch_short_name"
                  // label="简称"
                  placeholder="简称"
                  rules={[{ required: true, message: '请填写简称!' }]}
                />
                {/*<Divider/>*/}
              </ProFormList>
            );
          }}
        </ProFormDependency>

      </DrawerForm>
    </>
  );
};
