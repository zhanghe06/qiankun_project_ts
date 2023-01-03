import React, { useRef, useState } from 'react';
import {
  AppstoreOutlined, CloseOutlined, DeleteOutlined, ExclamationCircleOutlined,
  EyeOutlined,
  FormOutlined,
  MailOutlined,
  TableOutlined,
  PlusOutlined,
  SettingOutlined,
  DownOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu, Space, Layout, Row, Col, message, Modal, Dropdown } from 'antd';
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import {
  DrawerForm,
  ProForm,
  ProFormCheckbox,
  ProFormInstance, ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText
} from "@ant-design/pro-form";
const { Header, Content, Sider } = Layout;

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const treeList = [
    {
      id: 1,
      name: '采购目录树'
    },
    {
      id: 2,
      name: '销售目录树'
    }
  ]

  // const trees = [
  //   { label: '采购目录树', value: 1 },
  //   { label: '销售目录树', value: 2 },
  // ]
  const trees = treeList.map(x => Object.assign(
    {
      label: x.name,
      value: x.id,
    }
  ))

  // 销售目录树
  const salesTreeInfo = [
    {
      label: '2022',
      key: 'year:2022',
      children: [
        {
          label: '爱数信息',
          key: 'org:aishu',
          children: [
            {
              label: '上海爱数',
              key: 'org_branch:sh',
              children: [
                {
                  label: '销售场景',
                  key: 'scene:sales',
                  children: [
                    {
                      label: '销售订单',
                      key: 'node:sales_order',
                      // icon: <TableOutlined />,
                    },
                    {
                      label: '销售出库',
                      key: 'node:sales_stock',
                      // icon: <TableOutlined />,
                    },
                    {
                      label: '销售发票',
                      key: 'node:sales_invoice',
                      // icon: <TableOutlined />,
                    },
                  ],
                }
              ],
            },
            {
              label: '北京爱数',
              key: 'org_branch:bj',
            },
          ],
        },
      ],
    },
  ];

  // 采购目录树
  const purchaseTreeInfo = [
    {
      label: '2022',
      key: 'year:2022',
      children: [
        {
          label: '爱数信息',
          key: 'org:aishu',
          children: [
            {
              label: '上海爱数',
              key: 'org_branch:sh',
              children: [
                {
                  label: '采购场景',
                  key: 'scene:purchase',
                  children: [
                    {
                      label: '采购订单',
                      key: 'node:purchase_order',
                      // icon: <TableOutlined />,
                    },
                    {
                      label: '采购入库',
                      key: 'node:purchase_stock',
                      // icon: <TableOutlined />,
                    },
                    {
                      label: '采购发票',
                      key: 'node:purchase_invoice',
                      // icon: <TableOutlined />,
                    },
                  ],
                }
              ],
            },
            {
              label: '北京爱数',
              key: 'org_branch:bj',
            },
          ],
        },
      ],
    },
  ];

  // 采购订单服务
  const getPurchaseOrderConf = {
    fields: [
      {
        field: 'vendor_name',
        title: '供应商',
      },
      {
        field: 'order_code',
        title: '订单号',
      },
      {
        field: 'company_name',
        title: '公司名称',
      },
    ],
    filters: [
      {
        field: 'vendor_name',
        title: '供应商名称',
        valueType: 'text',
      },
      {
        field: 'head_type',
        title: '数据类型',
        valueType: 'select',
        valueEnum: {
          all: { text: '全部' },
          business: { text: '事务型' },
          ordinary: { text: '普通型' },
        }
      },
      {
        field: 'created',
        title: '创建日期',
        valueType: 'dateRange',
      },
    ]
  }

  // 表格字段
  const purchaseOrderConfTable = getPurchaseOrderConf.fields.map(x => Object.assign(
    {
      title: x.title,
      dataIndex: x.field,
      ellipsis: true,
      hideInSearch: true,
    }
  ))

  // 搜索字段
  const purchaseOrderConfFilter = getPurchaseOrderConf.filters.map(x => Object.assign({
    title: x.title,
    valueType: x.valueType,
    dataIndex: x.field,
    valueEnum: x.valueEnum,
    hideInTable: true,
  }))

  const purchaseOrderConf = purchaseOrderConfTable.concat(purchaseOrderConfFilter)

  const purchaseOrderData = [
    {
      id: 1,
      vendor_code: 'BJ001',
      vendor_name: '北京百度',
      order_code: 'PO20221228',
      company_code: '3030',
      company_name: '上海爱数',
    }
  ]

  const defaultConf = [
    {
      title: '序号',
      dataIndex: 'id',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '编号',
      dataIndex: 'code',
      ellipsis: true,
      hideInSearch: false,
    },
    {
      title: '描述',
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: false,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      ellipsis: true,
      hideInSearch: true,
    },
  ]

  const [tableConf, setTableConf] = useState<any[]>(defaultConf);
  const [tableData, setTableData] = useState<any[]>([]);
  const [treeInfo, setTreeInfo] = useState<any[]>([]);

  const handleMenuClick = (e: any) => {
    console.log(e.keyPath)

    // 采购订单
    if (e.key === 'node:purchase_order') {
      setTableConf(purchaseOrderConf)
      setTableData(purchaseOrderData)
      return
    } else {
      setTableConf(defaultConf)
      setTableData([])
    }
  }

  // const columns: ProColumns[] = [
  //   {
  //     title: '业务组类型',
  //     dataIndex: 'group',
  //     initialValue: '0',
  //     ellipsis: true,
  //     valueType: 'select',
  //     valueEnum: {
  //       0: {
  //         text: '全部分组',
  //       },
  //       1: {
  //         text: '基础信息',
  //       },
  //       2: {
  //         text: '主数据',
  //       },
  //       3: {
  //         text: '业务数据',
  //       },
  //       4: {
  //         text: '元数据',
  //       },
  //     },
  //   },
  //   {
  //     title: '业务组名称',
  //     dataIndex: 'segment',
  //     ellipsis: true,
  //   },
  //   {
  //     title: '业务事务型服务',
  //     dataIndex: 'data_type',
  //     ellipsis: true,
  //     valueEnum: {
  //       1: {
  //         text: '是',
  //       },
  //       2: {
  //         text: '否',
  //       },
  //     },
  //   },
  //   {
  //     title: '服务编号',
  //     dataIndex: 'name',
  //     ellipsis: true,
  //   },
  //   {
  //     title: '服务名称',
  //     dataIndex: 'note',
  //     ellipsis: true,
  //   },
  //   {
  //     title: '时间',
  //     dataIndex: 'created_at',
  //     valueType: 'dateTime',
  //     hideInSearch: true,
  //   },
  // ];

  const handleTreeChange = (item: { value: number; label: React.ReactNode } | undefined) => {
    console.log(item);
    if (item == undefined) {
      setTreeInfo([])
      return
    }
    //
    // const pItem = options.filter(i => i.value === item.value)[0]
    // const cItems = pItem?.children
    // const fields = cItems?.map((i) => Object.assign(
    //   {
    //     key: i.value,
    //     title: i.label
    //   }
    // ));
    if (item.value == 1) {
      setTreeInfo(purchaseTreeInfo)
      return
    }
    if (item.value == 2) {
      setTreeInfo(salesTreeInfo)
      return
    }
    setTreeInfo([])
  };

  return (
    <Layout style={{background: '#fff'}}>
      <Sider width={256} style={{background: '#fff'}}>
        <ProFormSelect
          width="sm"
          name="tree"
          fieldProps={{
            labelInValue: true,
            onChange: handleTreeChange,
            // optionItemRender(item) {
            //   return item.label + ' - ' + item.value;
            // },
          }}
          request={async () => trees}
          placeholder="请选择目录树"
        />
        <Menu
          onClick={handleMenuClick}
          style={{ width: 256 }}
          // defaultSelectedKeys={['business_01']}
          // defaultOpenKeys={['business']}
          mode="inline"
          items={treeInfo}
          inlineIndent={12}
        />
      </Sider>
      <Content style={{marginLeft: 15}}>
        <ProTable
          columns={tableConf}
          // actionRef={tableRef}
          cardBordered
          dataSource={tableData}
          // request={async () => {
          //   return {
          //     data: tableList,
          //     success: true,
          //     // 不传会使用 data 的长度，如果是分页一定要传
          //     total: 2,
          //   };
          // }}
          rowKey="id"
          // search={false}
          search={{
            defaultCollapsed: false,
            collapseRender: false,
            labelWidth: 'auto',
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse(),
            ],
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
          // headerTitle=""
        />
      </Content>
    </Layout>
  );
};
