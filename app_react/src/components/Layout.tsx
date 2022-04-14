import {Tabs} from 'antd';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Cert from './cert/Index';
import Strategy from './strategy/Index';
import Conf from './conf/Index';
import './Layout.css'


const {TabPane} = Tabs;

function callback(key: any) {
    // console.log(key);
}

export default () => {
    return (
        <Router basename={(window as any).__POWERED_BY_QIANKUN__ ? '/app/react/' : '/'}>
            <Route path='/' component={() => (
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="证书管理" key="1">
                        <Cert />
                    </TabPane>
                    <TabPane tab="策略管理" key="2">
                        <Strategy />
                    </TabPane>
                    <TabPane tab="邮箱配置" key="3">
                        <Conf />
                    </TabPane>
                </Tabs>
            )}>
            </Route>
        </Router>
    );
};
