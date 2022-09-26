import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DragSortTable } from '@ant-design/pro-table';

import {
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  CloseOutlined,
  PlusOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Modal, Button, Descriptions, message, Space, Row, Col, Transfer } from 'antd';
import moment from 'moment';
import { DrawerForm, ProFormInstance, ProFormSelect, ProFormText, ProFormCheckbox } from "@ant-design/pro-form";

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState<Item>();
  const [recordId, setRecordId] = useState<number>(0);
  const [drawerVisit, setDrawerVisit] = useState(false);
  const [scenes, setScenes] = useState<{key: string, title: string}[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);


  const dataDrag = [
    {
      key: 'key1',
      name: '寻源到下单',
      index: 0,
    },
    {
      key: 'key2',
      name: '采购到付款',
      index: 1,
    },
    {
      key: 'key3',
      name: '采购到入库',
      index: 2,
    },
    {
      key: 'key4',
      name: '采购到进票',
      index: 3,
    },
  ];

  const [dataSource, setDataSource] = useState(dataDrag);


  const getScenes = (sceneIds: number[]) => {
    const sceneOptions = options.filter(i => sceneIds.indexOf(i.id)!==-1)
    return sceneOptions?.map((i, index) => Object.assign(
      {
        key: i.id.toString(),
        name: i.name,
        index: index,
      }
    ));
  }

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

    setTargetKeys(record.scene?.map((i) => i.toString()));

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

  interface Option {
    id: number;
    // code: string;
    name: string;
  }

  const options: Option[] = [
    {
      id: 1,
      name: '寻源到下单',
    },
    {
      id: 2,
      name: '采购到付款',
    },
    {
      id: 3,
      name: '采购到入库',
    },
    {
      id: 4,
      name: '采购到进票',
    },
  ];

  type Item = {
    id: number;
    code: string;
    name: string;
    // scene: {id: number, code: string, name: string }[];
    scene: number[];
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
    // {
    //   title: '业务场景',
    //   dataIndex: 'scene',
    //   initialValue: '0',
    //   ellipsis: true,
    //   valueType: 'select',
    //   valueEnum: {
    //     0: {
    //       text: '全部场景',
    //     },
    //     1: {
    //       text: '采购到付款',
    //     },
    //     2: {
    //       text: '需求到付款',
    //     },
    //   },
    // },
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

  // const scenes = [
  //   { label: '采购到付款', value: 1 },
  //   { label: '需求到付款', value: 2 },
  // ]
  //
  // const scenesMap = new Map()
  // for (const item of scenes) {
  //   scenesMap.set(item.value, item.label)
  // }

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 12},
  };

  const handleChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

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
          {
            title: '排序',
            dataIndex: 'sort',
          },
          {
            title: '业务场景',
            dataIndex: 'name',
            className: 'drag-visible',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            valueType: 'option',
            render: () => [<a key="del"><DeleteOutlined/></a>],
          },
        ]}
        rowKey="key"
        search={false}
        options={false}
        pagination={false}
        dataSource={getScenes(row.scene)}
        dragSortKey="sort"
        dragSortHandlerRender={dragHandleRender}
        onDragSortEnd={handleDragSortEnd}
      />
    );
  };


  useEffect(() => {
    formRef.current?.setFieldsValue(
      {
        scene: targetKeys,
      }
    )
    return
  }, [targetKeys])

  useEffect(() => {
    const fields = options?.map((i) => Object.assign(
      {
        key: i.id.toString(),
        title: i.name
      }
    ));
    // console.log(fields)
    setScenes(fields || [])
  }, [])

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
                code: 'v_flow_purchase',
                name: '采购流程变式',
                scene: [1,2,3,4],
                created_at: 1602572994055,
              },
              {
                id: 2,
                segment: 2,
                code: 'v_flow_sales',
                name: '销售流程变式',
                scene: [],
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
          <Descriptions.Item label="变式编号">
            {info?.code}
          </Descriptions.Item>
          <Descriptions.Item label="变式名称">
            {info?.name}
          </Descriptions.Item>
          {/*<Descriptions.Item label="业务场景">*/}
          {/*  {scenesMap.get(info?.scene)}*/}
          {/*</Descriptions.Item>*/}
          <Descriptions.Item label="创建时间">
            {info?.created_at ? moment(info?.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <DrawerForm<{
        id?: number
        segment: number
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
        {/*<ProFormSelect*/}
        {/*  width="sm"*/}
        {/*  name="scene"*/}
        {/*  label="业务场景"*/}
        {/*  fieldProps={{*/}
        {/*    labelInValue: true,*/}
        {/*  }}*/}
        {/*  request={async () => scenes}*/}
        {/*  placeholder="请选择场景"*/}
        {/*  rules={[{ required: true, message: '请选择场景!' }]}*/}
        {/*/>*/}
        <ProFormCheckbox.Group
          name="scene"
          label="业务场景"
          options={[]}
          rules={[{ required: true, message: '请选择场景!' }]}
        >
          <Transfer
            dataSource={scenes}
            showSearch
            style={
              {
                width: 444,
              }
            }
            listStyle={
              {
                width: 222,
                height: 300,
              }
            }
            operations={['显示', '取消']}
            targetKeys={targetKeys}
            onChange={handleChange}
            render={item => `${item.title}`}
          />
        </ProFormCheckbox.Group>
      </DrawerForm>
    </>
  );
};
