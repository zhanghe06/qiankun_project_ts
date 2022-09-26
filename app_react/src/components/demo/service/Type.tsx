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
    segment: {id: number, code: string, name: string}[];
    created_at: number;
    deleted_at?: number;
  };

  const columns: ProColumns<Item>[] = [
    {
      title: '服务分组',
      dataIndex: 'name',
      ellipsis: true,
    },
    // {
    //   title: '时间',
    //   dataIndex: 'created_at',
    //   valueType: 'dateTime',
    //   hideInSearch: true,
    // },
  ];

  interface Option {
    id: number;
    code: string;
    name: string;
    segment?: Option[];
  }

  const options: Option[] = [
    {
      id: 1,
      code: 'basic',
      name: '基础信息',
      segment: [
        {
          id: 1,
          code: 'currency',
          name: '币种',
        },
        {
          id: 2,
          code: 'language',
          name: '语言',
        },
        {
          id: 3,
          code: 'country',
          name: '国家',
        },
      ],
    },
    {
      id: 2,
      code: 'main',
      name: '主数据',
      segment: [
        {
          id: 1,
          code: 'company',
          name: '公司代码',
        },
        {
          id: 2,
          code: 'organization',
          name: '组织架构',
        },
        {
          id: 3,
          code: 'factory',
          name: '工厂',
        },
      ],
    },
    {
      id: 3,
      code: 'business',
      name: '业务数据',
      segment: [
        {
          id: 1,
          code: 'purchase_inquiry',
          name: '采购询价',
        },
        {
          id: 2,
          code: 'purchase_order',
          name: '采购订单',
        },
        {
          id: 3,
          code: 'purchase_storage',
          name: '采购入库',
        },
        {
          id: 4,
          code: 'purchase_invoice',
          name: '进项发票',
        },
      ],
    },
    {
      id: 4,
      code: 'metadata',
      name: '元数据',
      segment: [
        {
          id: 1,
          code: 'doc_id',
          name: '文档编号',
        },
      ],
    },
  ];

  const getSegments = (segments: {id: number, code: string, name: string}[]) => {
    return segments?.map((i, index) => Object.assign(
      {
        key: i.id.toString(),
        name: `${i.name} (${i.code})`,
        index: index,
      }
    ));
  }

  const expandedRowRender = (row: Item) => {
    // console.log(row.scene)
    return (
      <ProTable
        columns={[
          {
            title: '业务分类',
            dataIndex: 'name',
          },
        ]}
        rowKey="key"
        headerTitle={false}
        search={false}
        options={false}
        pagination={false}
        dataSource={getSegments(row.segment)}
        showHeader={false}
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
                code: `basic`,
                name: `基础信息`,
                segment: [
                  {
                    id: 1,
                    code: 'currency',
                    name: '币种',
                  },
                  {
                    id: 2,
                    code: 'language',
                    name: '语言',
                  },
                  {
                    id: 3,
                    code: 'country',
                    name: '国家',
                  },
                ],
                created_at: 1602572994055,
              },
              {
                id: 2,
                code: `main`,
                name: `主数据`,
                segment: [
                  {
                    id: 1,
                    code: 'company',
                    name: '公司代码',
                  },
                  {
                    id: 2,
                    code: 'organization',
                    name: '组织架构',
                  },
                  {
                    id: 3,
                    code: 'factory',
                    name: '工厂',
                  },
                ],
                created_at: 1602572995055,
              },
              {
                id: 3,
                code: `business`,
                name: `业务数据`,
                segment: [
                  {
                    id: 1,
                    code: 'purchase_inquiry',
                    name: '采购询价',
                  },
                  {
                    id: 2,
                    code: 'purchase_order',
                    name: '采购订单',
                  },
                  {
                    id: 3,
                    code: 'purchase_storage',
                    name: '采购入库',
                  },
                  {
                    id: 4,
                    code: 'purchase_invoice',
                    name: '进项发票',
                  },
                ],
                created_at: 1602572996055,
              },
              {
                id: 4,
                code: `metadata`,
                name: `元数据`,
                segment: [
                  {
                    id: 1,
                    code: 'doc_id',
                    name: '文档编号',
                  },
                ],
                created_at: 1602572997055,
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
        headerTitle={false}
        expandable={{ expandedRowRender }}
      />
    </>
  );
};
