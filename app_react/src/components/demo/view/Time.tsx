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
import { Modal, Button, Descriptions, message, Space, Row, Col, Switch, RadioChangeEvent } from 'antd';
import moment from 'moment';
import { DrawerForm, ProFormInstance, ProFormSelect, ProFormText, ProFormRadio, ProFormDatePicker, ProFormSwitch } from "@ant-design/pro-form";
import { NoticeType } from "antd/lib/message";

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState<Item>();
  const [recordId, setRecordId] = useState<number>(0);
  const [startMonthDisabled, setStartMonthDisabled] = useState(false);
  const [baseYearDisabled, setBaseYearDisabled] = useState(true);
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

  const getStartMonth = (yearType: number) => {
    if (yearType === 1) {
      return 1
    }
    if (yearType === 2) {
      return 4
    }
    return 0
  }

  const getBaseYear = (baseYearType: number) => {
    return moment()
  }

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.year_type !== undefined) {
      const startMonth = getStartMonth(changedValues.year_type)
      formRef.current?.setFieldsValue({ start_month: startMonth });
      if (changedValues.year_type === 1) {
        setStartMonthDisabled(true)
      } else {
        setStartMonthDisabled(false)
      }
    }
    if (changedValues.base_year_type !== undefined) {
      const baseYear = getBaseYear(changedValues.base_year_type)
      formRef.current?.setFieldsValue({ base_year: baseYear });
      if (changedValues.base_year_type === 1) {
        setBaseYearDisabled(true)
      } else {
        setBaseYearDisabled(false)
      }
    }
  }

  const editInfo = (record: Item) => {
    setRecordId(record.id);
    // console.log(record);
    // console.log(formRef.current);
    formRef.current?.setFieldsValue(record);
    // setTimeout(() => {formRef.current?.setFieldsValue(record)}, 0)

    // console.log(record.base_year_type)
    // console.log(record.base_year)
    if (record.base_year_type === 1) {
      setBaseYearDisabled(true)
    } else {
      setBaseYearDisabled(false)
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
      getContainer: document.querySelector('#root-app-react') as HTMLElement,
      onOk: () => {
        message.success(
          {
            content: '删除成功',
            type: 'success',
            getPopupContainer: (triggerNode: HTMLElement) => document.querySelector('#root-app-react')!
          }
        );
        tableRef.current?.reload();
      }
    });
  }

  type Item = {
    id: number;
    code: string;
    name: string;
    year_type: number;
    start_month: number;
    base_year_type: number;
    base_year: string;
    show_year_limit: number;
    show_quarter: number;
    show_month: number;
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
      title: '年度类型',
      dataIndex: 'year_type',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部类型',
        },
        1: {
          text: '自然年度',
        },
        2: {
          text: '财经年度',
        },
      },
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '起始月份',
      dataIndex: 'start_month',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部月份',
        },
        1: {
          text: '1月',
        },
        2: {
          text: '2月',
        },
        3: {
          text: '3月',
        },
        4: {
          text: '4月',
        },
        5: {
          text: '5月',
        },
        6: {
          text: '6月',
        },
        7: {
          text: '7月',
        },
        8: {
          text: '8月',
        },
        9: {
          text: '9月',
        },
        10: {
          text: '10月',
        },
        11: {
          text: '11月',
        },
        12: {
          text: '12月',
        },
      },
      hideInSearch: true,
    },
    {
      title: '基准年度',
      dataIndex: 'base_year_type',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部类型',
        },
        1: {
          text: '系统年度',
        },
        2: {
          text: '指定年度',
        },
      },
      hideInSearch: true,
    },
    {
      title: '显示年数',
      dataIndex: 'show_year_limit',
      initialValue: '0',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全部年数',
        },
        3: {
          text: '3年',
        },
        5: {
          text: '5年',
        },
        7: {
          text: '7年',
        },
        10: {
          text: '10年',
        },
        100: {
          text: '无限制',
        },
      },
      hideInSearch: true,
    },
    {
      title: '显示季度',
      dataIndex: 'show_quarter',
      render: (_, record) => (
        <Switch checked={record.show_quarter == 1} key={"switch_show_quarter"+record.show_quarter} size="small"/>
      ),
      hideInSearch: true,
    },
    {
      title: '显示月度',
      dataIndex: 'show_month',
      render: (_, record) => (
        <Switch checked={record.show_month == 1} key={"switch_show_month"+record.show_month} size="small"/>
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

  const months = [
    { label: '1月', value: 1 },
    { label: '2月', value: 2 },
    { label: '3月', value: 3 },
    { label: '4月', value: 4 },
    { label: '5月', value: 5 },
    { label: '6月', value: 6 },
    { label: '7月', value: 7 },
    { label: '8月', value: 8 },
    { label: '9月', value: 9 },
    { label: '10月', value: 10 },
    { label: '11月', value: 11 },
    { label: '12月', value: 12 },
  ]

  const monthsMap = new Map()
  for (const item of months) {
    monthsMap.set(item.value, item.label)
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
                code: `v_time_month`,
                name: `月度变式`,
                year_type: 2,
                start_month: 3,
                base_year_type: 2,
                base_year: `2020`,
                show_year_limit: 3,
                show_quarter: 1,
                show_month: 1,
                created_at: 1602572994055,
              },
              {
                id: 2,
                code: `v_time_year`,
                name: `年度变式`,
                year_type: 1,
                start_month: 1,
                base_year_type: 1,
                base_year: `2022`,
                show_year_limit: 5,
                show_quarter: 0,
                show_month: 0,
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
          {/*<Descriptions.Item label="服务分类">*/}
          {/*  {segmentsMap.get(info?.segment)}*/}
          {/*</Descriptions.Item>*/}
          <Descriptions.Item label="变式名称">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {info?.created_at ? moment(info?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <DrawerForm<{
        id?: number;
        code: string;
        name: string;
        year_type: number;
        start_month: number;
        base_year_type: number;
        base_year: string;
        show_year_limit: number;
        show_quarter: number;
        show_month: number;
        created_at?: number;
        deleted_at?: number;
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
          placeholder="请输入编号"
          rules={[{ required: true, message: '请填写变式编号!' }]}
        />
        <ProFormText
          width="sm"
          name="name"
          label="变式名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请填写变式名称!' }]}
        />
        <ProFormRadio.Group
          width="sm"
          name="year_type"
          label="年度类型"
          initialValue={2}
          options={[
            {
              label: '自然年度',
              value: 1,
            },
            {
              label: '财经年度',
              value: 2,
            },
          ]}
          rules={[{ required: true, message: '请选择年度类型!' }]}
        />
        <ProFormSelect
          width="sm"
          name="start_month"
          label="起始月份"
          initialValue={4}
          dependencies={['year_type']}
          request={async (params) => params.year_type ===1 ? [
            {
              label: '1月',
              value: 1,
            },
          ] : [
            {
              label: '1月',
              value: 1,
            },
            {
              label: '2月',
              value: 2,
            },
            {
              label: '3月',
              value: 3,
            },
            {
              label: '4月',
              value: 4,
            },
            {
              label: '5月',
              value: 5,
            },
            {
              label: '6月',
              value: 6,
            },
            {
              label: '7月',
              value: 7,
            },
            {
              label: '8月',
              value: 8,
            },
            {
              label: '9月',
              value: 9,
            },
            {
              label: '10月',
              value: 10,
            },
            {
              label: '11月',
              value: 11,
            },
            {
              label: '12月',
              value: 12,
            },
          ]}
          disabled={startMonthDisabled}
          placeholder="请选择起始月份"
          rules={[{ required: true, message: '请选择起始月份!' }]}
        />
        <ProFormRadio.Group
          width="sm"
          name="base_year_type"
          label="基准年度"
          options={[
            {
              label: '系统年度',
              value: 1,
            },
            {
              label: '指定年度',
              value: 2,
            },
          ]}
          initialValue={1}
          rules={[{ required: true, message: '请选择基准年度!' }]}
        />
        <ProFormDatePicker.Year
          width="sm"
          name="base_year"
          label="基准年份"
          placeholder="请选择基准年份"
          initialValue={moment()}
          disabled={baseYearDisabled}
          rules={[{ required: true, message: '请选择基准年份!' }]}
        />
        <ProFormRadio.Group
          width="sm"
          name="show_year_limit"
          label="显示年数"
          radioType="button"
          initialValue={3}
          options={[
            {
              label: '3年',
              value: 3,
            },
            {
              label: '5年',
              value: 5,
            },
            {
              label: '7年',
              value: 7,
            },
            {
              label: '10年',
              value: 10,
            },
            {
              label: '无限制',
              value: 100,
            },
          ]}
          rules={[{ required: true, message: '请选择年度类型!' }]}
        />
        <ProFormSwitch
          width="sm"
          name="show_quarter"
          label="显示季度"
        />
        <ProFormSwitch
          width="sm"
          name="show_month"
          label="显示月度"
        />
      </DrawerForm>
    </>
  );
};
