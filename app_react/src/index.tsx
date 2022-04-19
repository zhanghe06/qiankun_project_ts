import './public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import "core-js/stable";
import "regenerator-runtime/runtime";
import './index.css';
import Layout from './components/Layout';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';

import zhCN from 'antd/lib/locale/zh_CN';
import zhTW from 'antd/lib/locale/zh_TW';
import enUS from 'antd/lib/locale/en_US';

import moment from 'moment';
import 'moment/locale/zh-cn'
import 'moment/locale/zh-tw'
import 'moment/locale/en-gb'

// ReactDOM.render(
//   <React.StrictMode>
//     <Layout />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// interface Props {
//     container?: any;
// }

function render(props: any) {
    console.log(props);
    const { container, lang, theme } = props;

    // 语言继承 (时间验证：moment().startOf('hour').fromNow();)
    let locale = zhCN;
    moment.locale('zh-cn')
    if (lang == 'zh-tw') {
        locale = zhTW;
        moment.locale('zh-tw')
    }
    if (lang == 'en-us') {
        locale = enUS;
        moment.locale('en-gb')
    }

    // 主题继承
    // ConfigProvider.config({
    //     theme: {
    //         primaryColor: '#ff0000',
    //     }
    // });

    ReactDOM.render(
        <ConfigProvider
            locale={locale}
            getPopupContainer={(triggerNode) => container ? container.querySelector('#root-app-react') : document.querySelector('#root-app-react')}
        >
            <Layout />
        </ConfigProvider>,
        // <Layout />,
        container ? container.querySelector('#root-app-react') : document.querySelector('#root-app-react')
    );
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
    render({});
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
    console.log('[react] react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
    console.log('[react] props from main framework', props);
    render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props: any) {
    const { container } = props;
    ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root-app-react') : document.querySelector('#root-app-react'));
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props: any) {
    console.log('[react] update props', props);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
