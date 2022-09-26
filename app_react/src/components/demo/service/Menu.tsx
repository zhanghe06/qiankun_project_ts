import React, { useState } from 'react';
import type { ProSettings } from '@ant-design/pro-layout';
import { PageContainer, ProLayout } from '@ant-design/pro-layout';
import { ChromeFilled, CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons';
import {
  CaretDownFilled,
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import { Dropdown, Input } from 'antd';

export default () => {
  const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');

  const menuProps = {
    route: {
      path: '/',
      routes: [
        {
          path: '/welcome',
          name: '欢迎',
          icon: <SmileFilled />,
          component: './Welcome',
        },
        {
          path: '/admin',
          name: '管理页',
          icon: <CrownFilled />,
          access: 'canAdmin',
          component: './Admin',
          routes: [
            {
              path: '/admin/sub-page1',
              name: '一级页面',
              icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
              component: './Welcome',
            },
            {
              path: '/admin/sub-page2',
              name: '二级页面',
              icon: <CrownFilled />,
              component: './Welcome',
            },
            {
              path: '/admin/sub-page3',
              name: '三级页面',
              icon: <CrownFilled />,
              component: './Welcome',
            },
          ],
        },
        {
          name: '列表页',
          icon: <TabletFilled />,
          path: '/list',
          component: './ListTableList',
          routes: [
            {
              path: '/list/sub-page',
              name: '列表页面',
              icon: <CrownFilled />,
              routes: [
                {
                  path: 'sub-sub-page1',
                  name: '一一级列表页面',
                  icon: <CrownFilled />,
                  component: './Welcome',
                },
                {
                  path: 'sub-sub-page2',
                  name: '一二级列表页面',
                  icon: <CrownFilled />,
                  component: './Welcome',
                },
                {
                  path: 'sub-sub-page3',
                  name: '一三级列表页面',
                  icon: <CrownFilled />,
                  component: './Welcome',
                },
              ],
            },
            {
              path: '/list/sub-page2',
              name: '二级列表页面',
              icon: <CrownFilled />,
              component: './Welcome',
            },
            {
              path: '/list/sub-page3',
              name: '三级列表页面',
              icon: <CrownFilled />,
              component: './Welcome',
            },
          ],
        },
        {
          path: 'https://ant.design',
          name: 'Ant Design 官网外链',
          icon: <ChromeFilled />,
        },
      ],
    },
    location: {
      pathname: '/',
    },
    appList: [
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        title: 'Ant Design',
        desc: '杭州市较知名的 UI 设计语言',
        url: 'https://ant.design',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        title: 'AntV',
        desc: '蚂蚁集团全新一代数据可视化解决方案',
        url: 'https://antv.vision/',
        target: '_blank',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
        title: 'Pro Components',
        desc: '专业级 UI 组件库',
        url: 'https://procomponents.ant.design/',
      },
      {
        icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
        title: 'umi',
        desc: '插件化的企业级前端应用框架。',
        url: 'https://umijs.org/zh-CN/docs',
      },

      {
        icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
        title: 'qiankun',
        desc: '可能是你见过最完善的微前端解决方案🧐',
        url: 'https://qiankun.umijs.org/',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
        title: '语雀',
        desc: '知识创作与分享工具',
        url: 'https://www.yuque.com/',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg',
        title: 'Kitchen ',
        desc: 'Sketch 工具集',
        url: 'https://kitchen.alipay.com/',
      },
      {
        icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
        title: 'dumi',
        desc: '为组件开发场景而生的文档工具',
        url: 'https://d.umijs.org/zh-CN',
      },
    ],
  };

  return (
    <>
      <ProLayout
        siderWidth={216}
        bgLayoutImgList={[
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            left: 85,
            bottom: 100,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            bottom: -68,
            right: -45,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
            bottom: 0,
            left: 0,
            width: '331px',
          },
        ]}
        {...menuProps}
        location={{
          pathname,
        }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          title: '七妮妮',
          size: 'small',
        }}
        actionsRender={() => {
          return [
            <InfoCircleFilled key="InfoCircleFilled" />,
            <QuestionCircleFilled key="QuestionCircleFilled" />,
            <GithubFilled key="GithubFilled" />,
          ];
        }}
        menuExtraRender={() => {
          return (
            <>
              <Dropdown placement="bottom" overlay={<></>}>
                <div
                  style={{
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                    minWidth: '180px',
                  }}
                  // className={css`
                  //   font-size: 16px;
                  //   margin-top: 24px;
                  //   padding: 0 12px;
                  //   &:hover {
                  //     background-color: rgba(0, 0, 0, 0.03);
                  //   }
                  // `}
                >
                  <span> 企业级资产中心</span>
                  <CaretDownFilled />
                </div>
              </Dropdown>

              <div
                key="SearchOutlined"
                aria-hidden
                style={{
                  marginBlockStart: '24px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <Input
                  style={{
                    borderRadius: 4,
                    marginInlineEnd: 12,
                    backgroundColor: 'rgba(0,0,0,0.03)',
                  }}
                  prefix={
                    <SearchOutlined
                      style={{
                        color: 'rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  }
                  placeholder="搜索方案"
                  bordered={false}
                />
                <PlusCircleFilled
                  style={{
                    color: 'var(--ant-primary-color)',
                    fontSize: 24,
                  }}
                />
              </div>
            </>
          );
        }}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              setPathname(item.path || '/welcome');
            }}
          >
            {dom}
          </div>
        )}
        {...{layout: 'side'}}
      >
        <PageContainer>
          {/*<ProCard*/}
          {/*  style={{*/}
          {/*    height: '100vh',*/}
          {/*    minHeight: 800,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <div />*/}
          {/*</ProCard>*/}
        </PageContainer>
      </ProLayout>
    </>
  );
};
