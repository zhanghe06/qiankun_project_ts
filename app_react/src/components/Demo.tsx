import React from 'react';
import { Tabs } from 'antd';
import { Card, Col, Row } from 'antd';
// import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import { HashRouter as Router, Route, NavLink } from 'react-router-dom'
import BusinessSegment from './demo/business/Segment';
import BusinessLevel from './demo/business/Level';
import BusinessScene from './demo/business/Scene';
import BusinessNode from './demo/business/Node';
import PermissionService from './demo/permission/Service';
import PermissionTree from './demo/permission/Tree';
// import ServiceGroup from './demo/service/Group';
// import ServiceSegment from './demo/service/Segment';
// import ServiceType from './demo/service/Type';
// import ServiceRegister from './demo/service/Register';
import ServiceManage from './demo/service/Manage';
import ServiceExtend from './demo/service/Extend';
import ViewFlow from './demo/view/Flow';
import ViewTime from './demo/view/Time';
import ViewOrganization from './demo/view/Organization';
import ViewTree from './demo/view/Tree';
// import Cert from './cert/Index';
// import Strategy from './strategy/Index';
// import Conf from './conf/Index';
import './Layout.css'


function callback(key: any) {
  // console.log(key);
}

const cardBodyStyle: React.CSSProperties = {
  textAlign: 'center',
  fontWeight: 'bold',
};

export default () => {
  return (
    <Router basename={(window as any).__POWERED_BY_QIANKUN__ ? '/app/react/' : '/'}>
      <Route path='/' component={() => (
        <Row gutter={16}>
          <Col span={8}>
            <NavLink to="/service">
              <Card hoverable={true} bodyStyle={cardBodyStyle} key="service">服务配置</Card>
            </NavLink>
          </Col>
          <Col span={8}>
            <NavLink to="/business">
              <Card hoverable={true} bodyStyle={cardBodyStyle} key="business">场景配置</Card>
            </NavLink>
          </Col>
          <Col span={8}>
            <NavLink to="/view">
              <Card hoverable={true} bodyStyle={cardBodyStyle} key="view">目录装配</Card>
            </NavLink>
          </Col>
          {/*<Col span={6}>*/}
          {/*  <NavLink to="/permission">*/}
          {/*    <Card hoverable={true} bodyStyle={cardBodyStyle} key="permission">权限配置</Card>*/}
          {/*  </NavLink>*/}
          {/*</Col>*/}
        </Row>
      )}>
      </Route>
      <Route path='/service' component={() => (
        <Tabs
          defaultActiveKey="1"
          onChange={callback}
          items={[
            // {
            //   label: `服务分组`,
            //   key: '1',
            //   children: <ServiceGroup/>,
            // },
            // {
            //   label: `服务分类`,
            //   key: '2',
            //   children: <ServiceSegment/>,
            // },
            // {
            //   label: `服务类别`,
            //   key: '3',
            //   children: <ServiceType/>,
            // },
            // {
            //   label: `服务注册`,
            //   key: '4',
            //   children: <ServiceRegister/>,
            // },
            {
              label: `服务注册`,
              key: '1',
              children: <ServiceManage/>,
            },
            {
              label: `服务扩展配置`,
              key: '2',
              children: <ServiceExtend/>,
            },
          ]}
        />
      )}>
      </Route>
      <Route path='/business' component={() => (
        <Tabs
          defaultActiveKey="1"
          onChange={callback}
          items={[
            {
              label: `场景对象`,
              key: '1',
              children: <BusinessSegment/>,
            },
            // {
            //   label: `场景对象服务`,
            //   key: '2',
            //   children: <BusinessLevel/>,
            // },
            {
              label: `业务场景`,
              key: '3',
              children: <BusinessScene/>,
            },
            {
              label: `业务节点`,
              key: '4',
              children: <BusinessNode/>,
            },
          ]}
        />
      )}>
      </Route>
      <Route path='/view' component={() => (
        <Tabs
          defaultActiveKey="4"
          onChange={callback}
          items={[
            {
              label: `时间变式`,
              key: '1',
              children: <ViewTime/>,
            },
            {
              label: `组织变式`,
              key: '2',
              children: <ViewOrganization/>,
            },
            {
              label: `流程变式`,
              key: '3',
              children: <ViewFlow/>,
            },
            {
              label: `目录配置`,
              key: '4',
              children: <ViewTree/>,
            },
          ]}
        />
      )}>
      </Route>
      <Route path='/permission' component={() => (
        <Tabs
          defaultActiveKey="1"
          onChange={callback}
          items={[
            {
              label: `服务权限`,
              key: '1',
              children: <PermissionService/>,
            },
            {
              label: `目录权限`,
              key: '2',
              children: <PermissionTree/>,
            },
          ]}
        />
      )}>
      </Route>
    </Router>
  );
};
